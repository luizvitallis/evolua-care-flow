import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Copy, RotateCcw, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const MODOS = [
  { id: "ac_vcv", label: "A/C VCV", desc: "Ventilação assisto-controlada com controle por volume." },
  { id: "ac_pcv", label: "A/C PCV", desc: "Ventilação assisto-controlada com controle por pressão." },
  { id: "simv_vcv", label: "SIMV VCV", desc: "Respirações mandatórias por volume associadas a respirações espontâneas com suporte." },
  { id: "simv_pcv", label: "SIMV PCV", desc: "Respirações mandatórias por pressão associadas a respirações espontâneas com suporte." },
  { id: "psv", label: "PSV", desc: "Modo espontâneo com pressão de suporte." },
  { id: "cpap", label: "CPAP", desc: "Respiração espontânea com pressão positiva contínua." },
  { id: "prvc", label: "PRVC", desc: "Modo híbrido que busca atingir volume alvo com ajuste automático de pressão." },
];

const FIELDS = {
  fio2:   { label: "FiO₂", unit: "%",     placeholder: "40", min: 21,  max: 100,  step: 1   },
  peep:   { label: "PEEP", unit: "cmH₂O", placeholder: "5",  min: 0,   max: 30,   step: 1   },
  vt:     { label: "VT",   unit: "mL",     placeholder: "450",min: 50,  max: 1000, step: 10  },
  vt_alvo:{ label: "VT alvo", unit: "mL",  placeholder: "450",min: 50,  max: 1000, step: 10  },
  fr:     { label: "FR",   unit: "irpm",   placeholder: "16", min: 1,   max: 60,   step: 1   },
  pinsp:  { label: "Pinsp",unit: "cmH₂O", placeholder: "14", min: 1,   max: 40,   step: 1   },
  ti:     { label: "Ti",   unit: "s",      placeholder: "0,9",min: 0.3, max: 3.0,  step: 0.1 },
  ps:     { label: "PS",   unit: "cmH₂O", placeholder: "10", min: 0,   max: 30,   step: 1   },
};

const MODE_FIELDS = {
  ac_vcv:   ["fio2", "peep", "vt", "fr"],
  ac_pcv:   ["fio2", "peep", "pinsp", "fr", "ti"],
  simv_vcv: ["fio2", "peep", "vt", "fr", "ps"],
  simv_pcv: ["fio2", "peep", "pinsp", "fr", "ti", "ps"],
  psv:      ["fio2", "peep", "ps"],
  cpap:     ["fio2", "peep"],
  prvc:     ["fio2", "peep", "vt_alvo", "fr", "ti"],
};

const SUMMARY_TEMPLATES = {
  ac_vcv:   (v) => `VM em A/C VCV, FiO₂ ${v.fio2}%, PEEP ${v.peep} cmH₂O, VT ${v.vt} mL, FR ${v.fr} irpm.`,
  ac_pcv:   (v) => `VM em A/C PCV, FiO₂ ${v.fio2}%, PEEP ${v.peep} cmH₂O, Pinsp ${v.pinsp} cmH₂O, FR ${v.fr} irpm, Ti ${v.ti} s.`,
  simv_vcv: (v) => `VM em SIMV VCV, FiO₂ ${v.fio2}%, PEEP ${v.peep} cmH₂O, VT ${v.vt} mL, FR ${v.fr} irpm, PS ${v.ps} cmH₂O.`,
  simv_pcv: (v) => `VM em SIMV PCV, FiO₂ ${v.fio2}%, PEEP ${v.peep} cmH₂O, Pinsp ${v.pinsp} cmH₂O, FR ${v.fr} irpm, Ti ${v.ti} s, PS ${v.ps} cmH₂O.`,
  psv:      (v) => `VM em PSV, FiO₂ ${v.fio2}%, PEEP ${v.peep} cmH₂O, PS ${v.ps} cmH₂O.`,
  cpap:     (v) => `VM em CPAP, FiO₂ ${v.fio2}%, PEEP ${v.peep} cmH₂O.`,
  prvc:     (v) => `VM em PRVC, FiO₂ ${v.fio2}%, PEEP ${v.peep} cmH₂O, VT alvo ${v.vt_alvo} mL, FR ${v.fr} irpm, Ti ${v.ti} s.`,
};

function FieldInput({ fieldKey, config, value, onChange }) {
  const numVal = value !== undefined && value !== "" ? parseFloat(value) : null;
  const displayVal = numVal !== null ? numVal : config.placeholder;
  const isDefault = numVal === null;

  const bigStep = config.step * 10;

  const adjust = (delta) => {
    const current = numVal !== null ? numVal : parseFloat(config.placeholder);
    const next = Math.min(config.max, Math.max(config.min, parseFloat((current + delta).toFixed(2))));
    onChange(fieldKey, String(next));
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground font-medium">
        {config.label}: <span className="text-muted-foreground/60">({config.unit})</span>
      </Label>
      <div className="flex items-center gap-1.5">
        {bigStep !== config.step && (
          <button
            type="button"
            onClick={() => adjust(-bigStep)}
            className="h-9 px-2 rounded-lg bg-muted/50 border border-border/50 text-xs font-bold text-muted-foreground hover:bg-muted transition-colors shrink-0"
          >
            -{bigStep}
          </button>
        )}
        <button
          type="button"
          onClick={() => adjust(-config.step)}
          className="h-9 w-9 rounded-lg bg-muted/50 border border-border/50 text-sm font-bold text-muted-foreground hover:bg-muted transition-colors shrink-0 flex items-center justify-center"
        >
          −
        </button>
        <div className={`flex-1 h-9 rounded-lg border border-border/60 bg-background flex items-center justify-center text-sm font-bold ${isDefault ? 'text-muted-foreground' : 'text-primary'}`}>
          {displayVal} {config.unit}
        </div>
        <button
          type="button"
          onClick={() => adjust(config.step)}
          className="h-9 w-9 rounded-lg bg-muted/50 border border-border/50 text-sm font-bold text-muted-foreground hover:bg-muted transition-colors shrink-0 flex items-center justify-center"
        >
          +
        </button>
        {bigStep !== config.step && (
          <button
            type="button"
            onClick={() => adjust(bigStep)}
            className="h-9 px-2 rounded-lg bg-muted/50 border border-border/50 text-xs font-bold text-muted-foreground hover:bg-muted transition-colors shrink-0"
          >
            +{bigStep}
          </button>
        )}
      </div>
    </div>
  );
}

export default function VentilacaoMecanica({ value, onChange }) {
  // value = { modo: string|null, params: { fio2: '', peep: '', ... }, enabled: bool }
  const vmData = value || { modo: null, params: {}, enabled: false };
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});
  const [modeOpen, setModeOpen] = useState(false);

  const selectedMode = MODOS.find((m) => m.id === vmData.modo);
  const activeFields = vmData.modo ? MODE_FIELDS[vmData.modo] || [] : [];

  const updateData = (newData) => {
    onChange({ ...vmData, ...newData });
  };

  const selectMode = (modoId) => {
    updateData({ modo: modoId, params: {}, enabled: true });
    setErrors({});
    setModeOpen(false);
  };

  const handleFieldChange = (fieldKey, val) => {
    const newParams = { ...vmData.params, [fieldKey]: val };
    updateData({ params: newParams });

    // Validate
    if (val !== "" && val !== undefined) {
      const config = FIELDS[fieldKey];
      const num = parseFloat(val);
      if (isNaN(num)) {
        setErrors((prev) => ({ ...prev, [fieldKey]: "Informe um valor válido" }));
      } else if (num < config.min || num > config.max) {
        setErrors((prev) => ({ ...prev, [fieldKey]: `Valor fora do intervalo (${config.min}–${config.max})` }));
      } else {
        setErrors((prev) => { const n = { ...prev }; delete n[fieldKey]; return n; });
      }
    } else {
      setErrors((prev) => { const n = { ...prev }; delete n[fieldKey]; return n; });
    }
  };

  const handleClear = () => {
    updateData({ modo: null, params: {}, enabled: false });
    setErrors({});
  };

  const getSummary = () => {
    if (!vmData.modo) return "";
    const tpl = SUMMARY_TEMPLATES[vmData.modo];
    if (!tpl) return "";
    const vals = {};
    for (const fk of activeFields) {
      vals[fk] = vmData.params[fk] || "__";
    }
    return tpl(vals);
  };

  const handleCopy = async () => {
    const summary = getSummary();
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    toast({ title: "Copiado!", description: "Resumo da VM copiado.", duration: 2000 });
    setTimeout(() => setCopied(false), 2000);
  };

  const summary = getSummary();
  const hasValues = activeFields.some((fk) => vmData.params[fk] && vmData.params[fk] !== "");

  return (
    <div className="rounded-2xl bg-card shadow-sm shadow-black/5 border border-border/50">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #e84393, #6c5ce7)" }}
          >
            <Wind className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-bold text-foreground text-sm">Ventilação Mecânica</h3>
          {vmData.modo && (
            <span
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white ml-auto"
              style={{ background: "linear-gradient(135deg, #e84393, #0984e3)" }}
            >
              {selectedMode?.label}
            </span>
          )}
        </div>

        {/* Mode Selector */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground font-medium">Modo Ventilatório</Label>
          <div className="relative">
            <button
              onClick={() => setModeOpen(!modeOpen)}
              className="w-full flex items-center justify-between h-10 px-3 rounded-xl bg-background border border-border/60 text-sm hover:bg-muted/40 transition-colors"
            >
              <span className={vmData.modo ? "text-foreground font-medium" : "text-muted-foreground"}>
                {selectedMode ? selectedMode.label : "Selecionar modo..."}
              </span>
              <motion.div animate={{ rotate: modeOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </button>

            <AnimatePresence>
              {modeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-50 mt-1 w-full bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                >
                  {MODOS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => selectMode(m.id)}
                      className={`w-full text-left px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors border-b border-border/30 last:border-0 ${
                        vmData.modo === m.id ? "bg-primary/10 font-medium text-primary" : "text-foreground"
                      }`}
                    >
                      <span className="font-semibold">{m.label}</span>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{m.desc}</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {selectedMode && !modeOpen && (
            <p className="text-xs text-muted-foreground italic">{selectedMode.desc}</p>
          )}
        </div>

        {/* Fields */}
        <AnimatePresence mode="wait">
          {vmData.modo && (
            <motion.div
              key={vmData.modo}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeFields.map((fk) => (
                  <FieldInput
                    key={fk}
                    fieldKey={fk}
                    config={FIELDS[fk]}
                    value={vmData.params[fk]}
                    onChange={handleFieldChange}
                  />
                ))}
              </div>

              {/* Summary */}
              {hasValues && (
                <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border/30">
                  <p className="text-xs text-muted-foreground mb-1 font-medium">Resumo:</p>
                  <p className="text-sm text-foreground leading-relaxed">{summary}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                {hasValues && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-1.5 rounded-xl text-xs h-8"
                    variant="outline"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copiado!" : "Copiar resumo"}
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  onClick={handleClear}
                  className="gap-1.5 rounded-xl text-xs h-8 text-muted-foreground"
                  variant="ghost"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Limpar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Utility: generate VM text for the evolution output
export function getVMSummaryText(vmData) {
  if (!vmData || !vmData.modo || !vmData.enabled) return null;
  const mode = MODOS.find((m) => m.id === vmData.modo);
  if (!mode) return null;
  const fields = MODE_FIELDS[vmData.modo] || [];
  const tpl = SUMMARY_TEMPLATES[vmData.modo];
  if (!tpl) return null;
  const vals = {};
  for (const fk of fields) {
    vals[fk] = vmData.params?.[fk] || "__";
  }
  return tpl(vals);
}