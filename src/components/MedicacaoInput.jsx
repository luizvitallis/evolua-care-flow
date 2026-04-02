import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const ANTIBIOTICOS = [
  "Amicacina",
  "Amoxicilina + Clavulanato",
  "Ampicilina",
  "Azitromicina",
  "Cefazolina",
  "Cefepime",
  "Ceftriaxona",
  "Ciprofloxacino",
  "Clindamicina",
  "Daptomicina",
  "Ertapenem",
  "Gentamicina",
  "Imipenem",
  "Levofloxacino",
  "Linezolida",
  "Meropenem",
  "Metronidazol",
  "Oxacilina",
  "Piperacilina + Tazobactam",
  "Polimixina B",
  "Sulfametoxazol + Trimetoprima",
  "Teicoplanina",
  "Vancomicina",
];

const MEDICACAO_OPTIONS = [
  "Antibiótico",
  "Cisatracurio",
  "Dobutamina",
  "Dopamina",
  "Dormonid",
  "Fentanil",
  "Ketamina",
  "Morfina",
  "Noradrenalina",
  "Precedex",
  "Propofol",
];

export function isMedicacaoSection(campo) {
  return campo === "medicacoes";
}

export function formatMedicacoes(paramValues) {
  const lines = [];

  for (const med of MEDICACAO_OPTIONS) {
    if (med === "Antibiótico") continue;
    const val = paramValues?.[med];
    if (!val) continue;
    let text = med;
    if (val.via) text += ` — ${val.via}`;
    if (val.vazao) text += `, ${val.vazao} ml/h`;
    lines.push(text);
  }

  // Antibiotics
  const abVal = paramValues?.["Antibiótico"];
  if (abVal?.items?.length > 0) {
    for (const item of abVal.items) {
      let text = `Antibiótico: ${item.nome}`;
      if (item.via) text += ` — ${item.via}`;
      if (item.vazao) text += `, ${item.vazao} ml/h`;
      lines.push(text);
    }
  }

  // Custom meds
  const custom = paramValues?.["__custom_medicacoes"];
  if (custom?.length > 0) {
    for (const item of custom) {
      if (!item.nome) continue;
      let text = item.nome;
      if (item.via) text += ` — ${item.via}`;
      if (item.vazao) text += `, ${item.vazao} ml/h`;
      lines.push(text);
    }
  }

  return lines;
}

function ViaVazaoInput({ value, onChange }) {
  const via = value?.via || "";
  const vazao = value?.vazao || "";

  const update = (field, val) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
      <div className="flex rounded-lg overflow-hidden border border-border/60">
        {["EV BIC", "EV"].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); update("via", opt); }}
            className={`px-2.5 py-1 text-xs font-medium transition-colors ${
              via === opt
                ? "bg-primary text-white"
                : "bg-background text-muted-foreground hover:bg-muted/60"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <input
          type="number"
          placeholder="Vazão"
          value={vazao}
          onChange={(e) => { e.stopPropagation(); update("vazao", e.target.value); }}
          onClick={(e) => e.stopPropagation()}
          className="w-16 text-xs bg-background border border-border rounded-md px-2 py-1.5 text-foreground"
          min="0"
          step="0.1"
        />
        <span className="text-xs text-muted-foreground">ml/h</span>
      </div>
    </div>
  );
}

function AntibioticoSelector({ value, onChange }) {
  const items = value?.items || [];
  const [showList, setShowList] = useState(true);

  const toggleAntibiotico = (nome) => {
    const exists = items.find((i) => i.nome === nome);
    let updated;
    if (exists) {
      updated = items.filter((i) => i.nome !== nome);
    } else {
      updated = [...items, { nome, via: "", vazao: "" }];
    }
    onChange({ ...value, items: updated });
  };

  const updateItem = (nome, field, val) => {
    const updated = items.map((i) =>
      i.nome === nome ? { ...i, [field]: val } : i
    );
    onChange({ ...value, items: updated });
  };

  return (
    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowList(!showList); }}
        className="text-xs text-primary font-medium hover:underline"
      >
        {showList ? "Ocultar lista" : "Selecionar antibióticos"}
      </button>
      {showList && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-48 overflow-y-auto rounded-lg border border-border/40 p-2 bg-muted/20">
          {ANTIBIOTICOS.map((ab) => {
            const selected = items.some((i) => i.nome === ab);
            return (
              <label key={ab} className="flex items-center gap-2 px-1.5 py-1 rounded cursor-pointer hover:bg-muted/40 text-xs">
                <Checkbox
                  checked={selected}
                  onCheckedChange={() => toggleAntibiotico(ab)}
                  className="shrink-0"
                />
                <span className={selected ? "text-foreground font-medium" : "text-muted-foreground"}>
                  {ab}
                </span>
              </label>
            );
          })}
        </div>
      )}
      {items.length > 0 && (
        <div className="space-y-1.5 pl-1">
          {items.map((item) => (
            <div key={item.nome} className="space-y-1">
              <span className="text-xs font-medium text-foreground">{item.nome}</span>
              <ViaVazaoInput
                value={item}
                onChange={(updated) => {
                  const newItems = items.map((i) =>
                    i.nome === item.nome ? { ...updated, nome: item.nome } : i
                  );
                  onChange({ ...value, items: newItems });
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CustomMedicacoes({ value, onChange }) {
  const items = value || [];
  const [newName, setNewName] = useState("");

  const addCustom = () => {
    if (!newName.trim()) return;
    onChange([...items, { nome: newName.trim(), via: "", vazao: "" }]);
    setNewName("");
  };

  const removeCustom = (idx) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const updateCustom = (idx, updated) => {
    onChange(items.map((item, i) => (i === idx ? { ...updated, nome: item.nome } : item)));
  };

  return (
    <div className="space-y-2 border-t border-border/40 pt-3 mt-2" onClick={(e) => e.stopPropagation()}>
      <span className="text-xs font-medium text-muted-foreground">Outras medicações</span>
      {items.map((item, idx) => (
        <div key={idx} className="space-y-1 bg-muted/20 rounded-lg p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">{item.nome}</span>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeCustom(idx); }}
              className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-destructive"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <ViaVazaoInput value={item} onChange={(updated) => updateCustom(idx, updated)} />
        </div>
      ))}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Nome da medicação"
          value={newName}
          onChange={(e) => { e.stopPropagation(); setNewName(e.target.value); }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
          className="flex-1 text-xs bg-background border border-border rounded-md px-2 py-1.5 text-foreground"
        />
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); addCustom(); }}
          disabled={!newName.trim()}
          className="px-2 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 disabled:opacity-40 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Adicionar
        </button>
      </div>
    </div>
  );
}

export default function MedicacaoInput({ opcao, value, onChange, paramValues, onParamChange }) {
  if (opcao === "Antibiótico") {
    return (
      <AntibioticoSelector
        value={paramValues?.["Antibiótico"]}
        onChange={(val) => onParamChange?.("Antibiótico", val)}
      />
    );
  }

  return (
    <ViaVazaoInput
      value={value}
      onChange={onChange}
    />
  );
}

export function MedicacaoCustomArea({ paramValues, onParamChange }) {
  return (
    <CustomMedicacoes
      value={paramValues?.["__custom_medicacoes"]}
      onChange={(val) => onParamChange?.("__custom_medicacoes", val)}
    />
  );
}
