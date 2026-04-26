import medicoAtencaoPrimaria from "./templates/medicoAtencaoPrimaria";
import medicoHospitalar from "./templates/medicoHospitalar";
import enfermeiroAtencaoPrimaria from "./templates/enfermeiroAtencaoPrimaria";
import enfermeiroHospitalar from "./templates/enfermeiroHospitalar";
import { formatLesaoPressao } from "../components/LesaoPressaoInput";
import { formatFerida } from "../components/FeridaInput";
import { formatQueimadura } from "../components/QueimaduraInput";
import { formatDreno } from "../components/DrenoInput";
import { isDispositivoOption, formatDispositivo, isDispositivoWithDate } from "../components/DispositivoInput";
import { formatMedicacoes } from "../components/MedicacaoInput";
import { hasVariant, fillVariant } from "./variantUtils";
import { adaptGender } from "./genderUtils";
import { formatDateBR, calcDIH, nowBR } from "./dateUtils";

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
  const { dateStr, timeStr } = nowBR();

  const perfilLabel = perfil === "medico" ? "EVOLUÇÃO MÉDICA" : "EVOLUÇÃO DE ENFERMAGEM";
  lines.push(`${perfilLabel} — ${dateStr} às ${timeStr}`);

  if (patientInfo) {
    if (patientInfo.nome) lines.push(`Paciente: ${patientInfo.nome}`);
    if (patientInfo.idade) lines.push(`Idade: ${patientInfo.idade} anos`);
    if (patientInfo.diagnostico) lines.push(`Diagnóstico: ${patientInfo.diagnostico}`);
    if (patientInfo.dataAdmissao) {
      lines.push(`Data de Admissão: ${formatDateBR(patientInfo.dataAdmissao)}`);
      const dih = calcDIH(patientInfo.dataAdmissao);
      if (dih !== null) lines.push(`Dias de Internação: ${dih}º DIH`);
    }
  }

  for (const grupo of template.grupos) {
    const selected = selections[grupo.campo] || [];

    // Special handling for medications section
    if (grupo.campo === "medicacoes") {
      const medLines = formatMedicacoes(paramValues);
      if (selected.length > 0 || medLines.length > 0) {
        lines.push(`${grupo.titulo.toUpperCase()}:`);
        const allMedLines = [];
        // Format selected predefined meds (non-Antibiótico, non-Hemotransfusão)
        for (const item of selected) {
          if (item === "Antibiótico" || item === "Hemotransfusão") continue;
          const val = paramValues?.[item];
          let text = hasVariant(item) ? fillVariant(item, val?.v ?? 0) : item;
          if (val?.via) text += ` — ${val.via}`;
          if (val?.vazao) text += `, ${val.vazao} ml/h`;
          allMedLines.push(text);
        }
        // Antibiotics
        if (selected.includes("Antibiótico")) {
          const abVal = paramValues?.["Antibiótico"];
          if (abVal?.items?.length > 0) {
            for (const ab of abVal.items) {
              let text = `Antibiótico: ${ab.nome}`;
              if (ab.via) text += ` — ${ab.via}`;
              if (ab.vazao) text += `, ${ab.vazao} ml/h`;
              allMedLines.push(text);
            }
          } else {
            allMedLines.push("Antibiótico");
          }
        }
        // Hemotransfusão
        if (selected.includes("Hemotransfusão")) {
          const htVal = paramValues?.["Hemotransfusão"];
          if (htVal?.components?.length > 0) {
            allMedLines.push(`Hemotransfusão: ${htVal.components.join(", ")}`);
          } else {
            allMedLines.push("Hemotransfusão");
          }
        }
        // Custom meds
        const custom = paramValues?.["__custom_medicacoes"];
        if (custom?.length > 0) {
          for (const c of custom) {
            if (!c.nome) continue;
            let text = c.nome;
            if (c.via) text += ` — ${c.via}`;
            if (c.vazao) text += `, ${c.vazao} ml/h`;
            allMedLines.push(text);
          }
        }
        if (allMedLines.length > 0) {
          lines.push(allMedLines.join(". ") + ".");
        }
      }
    } else if (selected.length > 0) {
      lines.push(`${grupo.titulo.toUpperCase()}:`);
      const filledItems = selected.map((item) => {
        if (item === "Presença de lesão por pressão" && paramValues && paramValues[item]) {
          return formatLesaoPressao(paramValues[item]);
        }
        if (item === "Ferida" && paramValues && paramValues[item]) {
          return formatFerida(paramValues[item]);
        }
        if (item === "Queimadura" && paramValues && paramValues[item]) {
          return formatQueimadura(paramValues[item]);
        }
        if (item === "Dreno" && paramValues && paramValues[item]) {
          return formatDreno(paramValues[item]);
        }
        if (isDispositivoOption(item) && paramValues && paramValues[item]) {
          return formatDispositivo(item, paramValues[item]);
        }
        // Dispositivos with date only (no location config)
        if (isDispositivoWithDate(item, grupo.campo) && !isDispositivoOption(item) && paramValues && paramValues[item]) {
          return formatDispositivo(item, paramValues[item]);
        }

        const pv = paramValues?.[item];
        const isVariantItem = hasVariant(item);
        let processed = item;
        if (isVariantItem) {
          processed = fillVariant(item, pv?.v ?? 0);
        }

        if (processed.includes("___")) {
          const vals = isVariantItem ? pv?.p : pv;
          if (vals !== undefined && vals !== null) {
            if (typeof vals === "object") {
              let result = processed;
              const indices = Object.keys(vals)
                .map(Number)
                .filter((n) => !isNaN(n))
                .sort((a, b) => b - a);
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
            return processed.replace(/___/g, String(vals));
          }
        }

        return processed;
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

  const text = lines.join("\n");
  return adaptGender(text, patientInfo?.sexo);
}

export default templates;