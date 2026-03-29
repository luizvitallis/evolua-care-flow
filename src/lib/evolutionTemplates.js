import medicoAtencaoPrimaria from "./templates/medicoAtencaoPrimaria";
import medicoHospitalar from "./templates/medicoHospitalar";
import enfermeiroAtencaoPrimaria from "./templates/enfermeiroAtencaoPrimaria";
import enfermeiroHospitalar from "./templates/enfermeiroHospitalar";
import { formatLesaoPressao } from "../components/LesaoPressaoInput";
import { isDispositivoOption, formatDispositivo } from "../components/DispositivoInput";

function formatCruzVal(val) {
  const n = parseInt(val);
  if (isNaN(n) || n < 1 || n > 4) return String(val);
  return "+".repeat(n);
}

const templates = {
  medico: {
    atencao_primaria: medicoAtencaoPrimaria,
    ambiente_hospitalar: medicoHospitalar,
  },
  enfermeiro: {
    atencao_primaria: enfermeiroAtencaoPrimaria,
    ambiente_hospitalar: enfermeiroHospitalar,
  },
};

export function getTemplates(perfil, ambiente) {
  return templates[perfil]?.[ambiente] || [];
}

export function generateEvolutionText(perfil, template, selections, freeText, patientInfo, paramValues, vmData) {
  const lines = [];
  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR");
  const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const perfilLabel = perfil === "medico" ? "EVOLUÇÃO MÉDICA" : "EVOLUÇÃO DE ENFERMAGEM";
  lines.push(`${perfilLabel} — ${dateStr} às ${timeStr}`);

  if (patientInfo) {
    if (patientInfo.nome) lines.push(`Paciente: ${patientInfo.nome}`);
    if (patientInfo.idade) lines.push(`Idade: ${patientInfo.idade} anos`);
    if (patientInfo.diagnostico) lines.push(`Diagnóstico: ${patientInfo.diagnostico}`);
    if (patientInfo.dataAdmissao) {
      lines.push(`Data de Admissão: ${new Date(patientInfo.dataAdmissao).toLocaleDateString("pt-BR")}`);
      const admDate = new Date(patientInfo.dataAdmissao);
      const diffTime = now.getTime() - admDate.getTime();
      const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
      lines.push(`Dias de Internação: ${diffDays}º DIH`);
    }
  }

  for (const grupo of template.grupos) {
    const selected = selections[grupo.campo] || [];
    if (selected.length > 0) {
      lines.push(`${grupo.titulo.toUpperCase()}:`);
      const filledItems = selected.map((item) => {
        if (item === "Presença de lesão por pressão" && paramValues && paramValues[item]) {
          return formatLesaoPressao(paramValues[item]);
        }
        if (isDispositivoOption(item) && paramValues && paramValues[item]) {
          return formatDispositivo(item, paramValues[item]);
        }
        if (item.includes("___") && paramValues && paramValues[item] !== undefined) {
          const vals = paramValues[item];
          if (typeof vals === "object" && vals !== null) {
            let result = item;
            const indices = Object.keys(vals).map(Number).sort((a, b) => b - a);
            for (const idx of indices) {
              let pos = -1;
              let searchFrom = 0;
              for (let j = 0; j <= idx; j++) {
                pos = result.indexOf("___", searchFrom);
                searchFrom = pos + 3;
              }
              if (pos >= 0) {
                const isCruz = result.slice(pos + 3).startsWith("/4+");
                const fillVal = isCruz ? formatCruzVal(vals[idx]) : String(vals[idx]);
                result = result.slice(0, pos) + fillVal + result.slice(pos + 3);
              }
            }
            return result;
          }
          return item.replace(/___/g, String(vals));
        }
        return item;
      });
      lines.push(filledItems.join(". ") + ".");
    }

    // Insert VM summary right after respiratório
    if (grupo.campo === "respiratorio" && vmData && vmData.modo && vmData.enabled) {
      const SUMMARY_TEMPLATES = {
        ac_vcv: (v) => `VM em A/C VCV, FiO\u2082 ${v.fio2}%, PEEP ${v.peep} cmH\u2082O, VT ${v.vt} mL, FR ${v.fr} irpm.`,
        ac_pcv: (v) => `VM em A/C PCV, FiO\u2082 ${v.fio2}%, PEEP ${v.peep} cmH\u2082O, Pinsp ${v.pinsp} cmH\u2082O, FR ${v.fr} irpm, Ti ${v.ti} s.`,
        simv_vcv: (v) => `VM em SIMV VCV, FiO\u2082 ${v.fio2}%, PEEP ${v.peep} cmH\u2082O, VT ${v.vt} mL, FR ${v.fr} irpm, PS ${v.ps} cmH\u2082O.`,
        simv_pcv: (v) => `VM em SIMV PCV, FiO\u2082 ${v.fio2}%, PEEP ${v.peep} cmH\u2082O, Pinsp ${v.pinsp} cmH\u2082O, FR ${v.fr} irpm, Ti ${v.ti} s, PS ${v.ps} cmH\u2082O.`,
        psv: (v) => `VM em PSV, FiO\u2082 ${v.fio2}%, PEEP ${v.peep} cmH\u2082O, PS ${v.ps} cmH\u2082O.`,
        cpap: (v) => `VM em CPAP, FiO\u2082 ${v.fio2}%, PEEP ${v.peep} cmH\u2082O.`,
        prvc: (v) => `VM em PRVC, FiO\u2082 ${v.fio2}%, PEEP ${v.peep} cmH\u2082O, VT alvo ${v.vt_alvo} mL, FR ${v.fr} irpm, Ti ${v.ti} s.`,
      };
      const MODE_FIELDS = { ac_vcv: ["fio2","peep","vt","fr"], ac_pcv: ["fio2","peep","pinsp","fr","ti"], simv_vcv: ["fio2","peep","vt","fr","ps"], simv_pcv: ["fio2","peep","pinsp","fr","ti","ps"], psv: ["fio2","peep","ps"], cpap: ["fio2","peep"], prvc: ["fio2","peep","vt_alvo","fr","ti"] };
      const fields = MODE_FIELDS[vmData.modo] || [];
      const tpl = SUMMARY_TEMPLATES[vmData.modo];
      if (tpl) {
        const vals = {};
        for (const fk of fields) { vals[fk] = vmData.params?.[fk] || "__"; }
        lines.push("VENTILAÇÃO MECÂNICA:");
        lines.push(tpl(vals));
      }
    }
  }

  if (freeText && freeText.trim()) {
    lines.push("OBSERVAÇÕES ADICIONAIS:");
    lines.push(freeText.trim());
  }

  return lines.join("\n");
}

export default templates;