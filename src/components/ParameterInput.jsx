import { Minus, Plus } from "lucide-react";

const CRUZ_LABELS = {
  edema: { 1: "discreto", 2: "visível", 3: "bem evidente", 4: "intenso (cacifo importante)" },
  desidratacao: { 1: "leve", 2: "moderada", 3: "acentuada", 4: "grave (sinais clínicos evidentes)" },
  ictericia: { 1: "discreta", 2: "leve", 3: "moderada", 4: "intensa (pele toda amarelada)" },
  descoro: { 1: "leve", 2: "moderado", 3: "acentuado", 4: "palidez acentuada" },
};

function getCruzContext(opcao) {
  if (!opcao) return null;
  const lower = opcao.toLowerCase();
  if (lower.includes("edema")) return "edema";
  if (lower.includes("desidratad")) return "desidratacao";
  if (lower.includes("ictéric") || lower.includes("icter")) return "ictericia";
  if (lower.includes("descorad") || lower.includes("descoro")) return "descoro";
  return null;
}

const PARAM_DEFS = [
  { key: "EVA", match: (s) => s.includes("EVA"), min: 0, max: 10, step: 1, bigStep: null, unit: "", suffix: "/10" },
  { key: "Glasgow", match: (s) => s.includes("Glasgow"), min: 3, max: 15, step: 1, bigStep: null, unit: "", suffix: "" },
  { key: "RASS", match: (s) => s.includes("RASS"), min: -5, max: 4, step: 1, bigStep: null, unit: "", suffix: "" },
  { key: "SatO\u2082", match: (s) => s.includes("SatO\u2082"), min: 50, max: 100, step: 1, bigStep: 10, unit: "%", suffix: "" },
  { key: "FiO\u2082", match: (s) => s.includes("FiO\u2082"), min: 21, max: 100, step: 1, bigStep: 10, unit: "%", suffix: "" },
  { key: "PEEP", match: (s) => s.includes("PEEP"), min: 3, max: 30, step: 1, bigStep: 5, unit: "cmH\u2082O", suffix: "" },
  { key: "L/min", match: (s) => s.includes("L/min"), min: 1, max: 15, step: 1, bigStep: null, unit: "L/min", suffix: "" },
  { key: "PAS", match: (s, opcao, idx) => opcao && opcao.includes("mmHg") && opcao.includes("___x___") && idx === 0, min: 60, max: 250, step: 1, bigStep: 10, unit: "", suffix: "", defaultVal: 120 },
  { key: "PAD", match: (s, opcao, idx) => opcao && opcao.includes("mmHg") && opcao.includes("___x___") && idx === 1, min: 30, max: 150, step: 1, bigStep: 10, unit: "", suffix: "", defaultVal: 80 },
  { key: "FC", match: (s) => s.includes("FC") && s.includes("bpm"), min: 30, max: 220, step: 1, bigStep: 10, unit: "bpm", suffix: "" },
  { key: "Tax", match: (s) => s.includes("Tax"), min: 35, max: 42, step: 0.1, bigStep: null, unit: "\u00b0C", suffix: "" },
  { key: "°C", match: (s) => s.includes("°C") && !s.includes("Tax"), min: 35, max: 42, step: 0.1, bigStep: null, unit: "°C", suffix: "" },
  { key: "+/4+", match: (s) => s.includes("/4+"), min: 1, max: 4, step: 1, bigStep: null, unit: "/4+", suffix: "", formatVal: (v) => "+".repeat(v) + "/4+" },
  { key: "mcg/kg/min", match: (s) => s.includes("mcg/kg/min"), min: 0.01, max: 2, step: 0.01, bigStep: null, unit: "mcg/kg/min", suffix: "" },
  { key: "cmH\u2082O", match: (s) => s.includes("cmH\u2082O") && !s.includes("PEEP"), min: 0, max: 30, step: 1, bigStep: null, unit: "cmH\u2082O", suffix: "" },
  { key: "ml/kg/h", match: (s) => s.includes("ml/kg/h"), min: 0, max: 10, step: 0.1, bigStep: null, unit: "ml/kg/h", suffix: "" },
  { key: "dias", match: (s) => s.includes("dias"), min: 1, max: 30, step: 1, bigStep: null, unit: "dias", suffix: "" },
];

function detectParams(opcao) {
  const parts = opcao.split("___");
  if (parts.length <= 1) return [];

  const params = [];
  for (let i = 0; i < parts.length - 1; i++) {
    const before = parts[i];
    const after = parts[i + 1];
    const context = before.slice(-20) + "___" + after.slice(0, 20);

    let matched = null;
    for (const def of PARAM_DEFS) {
      if (def.match(context, opcao, i)) {
        matched = def;
        break;
      }
    }

    params.push({
      index: i,
      label: matched ? matched.key : `Valor ${i + 1}`,
      config: matched || { min: 1, max: 100, step: 1, bigStep: null, unit: "", suffix: "" },
    });
  }

  return params;
}

export function hasParameter(opcao) {
  return opcao.includes("___");
}

export function fillParameter(opcao, values) {
  if (!hasParameter(opcao)) return opcao;
  if (!values) return opcao;

  if (typeof values === "number") {
    return opcao.replace("___", String(values));
  }

  let result = opcao;
  const params = detectParams(opcao);
  for (let i = params.length - 1; i >= 0; i--) {
    const val = values[i];
    if (val !== undefined && val !== null) {
      const config = params[i].config;
      const displayVal = config.step < 1 ? parseFloat(val).toFixed(1) : String(val);
      let idx = -1;
      let searchFrom = 0;
      for (let j = 0; j <= i; j++) {
        idx = result.indexOf("___", searchFrom);
        searchFrom = idx + 3;
      }
      if (idx >= 0) {
        const fillVal = config.formatVal ? config.formatVal(parseFloat(displayVal)) : displayVal;
        result = result.slice(0, idx) + fillVal + result.slice(idx + 3);
      }
    }
  }
  return result;
}

function SingleParam({ label, config, value, onChange, cruzLabel }) {
  const currentVal = value ?? config.defaultVal ?? config.min;
  const displayVal = config.step < 1 ? currentVal.toFixed(1) : currentVal;
  const bigStep = config.bigStep;

  const clamp = (v) => Math.min(config.max, Math.max(config.min, parseFloat(v.toFixed(2))));

  const decrease = (e, amount) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(clamp(currentVal - amount));
  };

  const increase = (e, amount) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(clamp(currentVal + amount));
  };

  return (
    <div className="flex flex-col gap-0.5">
    <div className="flex items-center gap-1">
      <span className="text-xs text-muted-foreground font-medium min-w-[3rem]">{label}:</span>
      
      {/* Big step down */}
      {bigStep && (
        <button
          type="button"
          onClick={(e) => decrease(e, bigStep)}
          className="w-7 h-7 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"
          title={`-${bigStep}`}
        >
          <span className="text-xs font-bold">−{bigStep}</span>
        </button>
      )}

      {/* Unit step down */}
      <button
        type="button"
        onClick={(e) => decrease(e, config.step)}
        className="w-7 h-7 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <div className="min-w-[3rem] text-center">
        <span className="text-sm font-bold text-primary">{config.formatVal ? config.formatVal(currentVal) : displayVal}</span>
        {!config.formatVal && config.unit && <span className="text-xs text-muted-foreground ml-0.5">{config.unit}</span>}
        {config.suffix && <span className="text-xs text-muted-foreground">{config.suffix}</span>}
      </div>

      {/* Unit step up */}
      <button
        type="button"
        onClick={(e) => increase(e, config.step)}
        className="w-7 h-7 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      {/* Big step up */}
      {bigStep && (
        <button
          type="button"
          onClick={(e) => increase(e, bigStep)}
          className="w-7 h-7 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"
          title={`+${bigStep}`}
        >
          <span className="text-xs font-bold">+{bigStep}</span>
        </button>
      )}
    </div>
    {cruzLabel && <span className="text-[11px] text-primary/70 font-medium ml-[3.25rem] italic">{cruzLabel}</span>}
    </div>
  );
}

export default function ParameterInput({ opcao, value, onChange }) {
  const params = detectParams(opcao);
  const values = typeof value === "object" && value !== null ? value : {};

  const handleChange = (paramIdx, newVal) => {
    const updated = { ...values, [paramIdx]: newVal };
    onChange(updated);
  };

  return (
    <div
      className="flex flex-col gap-1.5 mt-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      {params.map((p) => {
        const cruzCtx = p.config.unit === "+/4+" ? getCruzContext(opcao) : null;
        const currentV = values[p.index] ?? p.config.defaultVal ?? p.config.min;
        const cruzLabel = cruzCtx ? CRUZ_LABELS[cruzCtx]?.[currentV] || null : null;
        return (
          <SingleParam
            key={p.index}
            label={p.label}
            config={p.config}
            value={currentV}
            onChange={(val) => handleChange(p.index, val)}
            cruzLabel={cruzLabel}
          />
        );
      })}
    </div>
  );
}