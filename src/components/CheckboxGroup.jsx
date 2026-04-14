import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import ParameterInput, { hasParameter } from "./ParameterInput";
import LesaoPressaoInput from "./LesaoPressaoInput";
import DispositivoInput, { isDispositivoOption, isDispositivoWithDate, DispositivoDateInput } from "./DispositivoInput";
import MedicacaoInput, { isMedicacaoSection, MedicacaoCustomArea } from "./MedicacaoInput";
import VariantInput from "./VariantInput";
import { hasVariant, fillVariant } from "../lib/variantUtils";
import { adaptGender } from "../lib/genderUtils";

export default function CheckboxGroup({ titulo, opcoes, selected, onToggle, paramValues, onParamChange, sexo, campo }) {
  const [expanded, setExpanded] = useState(true);
  const count = selected.length;
  const isMedicacao = isMedicacaoSection(campo);

  return (
    <div className="rounded-2xl bg-card shadow-sm shadow-black/5 border border-border/50 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-foreground text-sm">{titulo}</h3>
          {count > 0 && (
            <span
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white"
              style={{ background: "linear-gradient(135deg, #e84393, #0984e3)" }}
            >
              {count}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-1.5">
              {opcoes.map((opcao, idx) => {
                const isSelected = selected.includes(opcao);
                const isVariant = hasVariant(opcao);
                const rawParamVal = paramValues?.[opcao];
                const variantIdx = isVariant ? (rawParamVal?.v ?? 0) : null;
                const effectiveOption = isVariant ? fillVariant(opcao, variantIdx) : opcao;
                const numParamVal = isVariant ? rawParamVal?.p : rawParamVal;
                const hasParam = hasParameter(effectiveOption);
                const displaySource = isVariant
                  ? opcao.replace(/\{[^{}]+\}/g, "•••")
                  : opcao;
                const displayLabel = adaptGender(displaySource.replace(/___\/4\+/g, "+/4+").replace(/___/g, "•••"), sexo);
                const showDispositivoFull = isSelected && isDispositivoOption(opcao);
                const showDispositivoDate = isSelected && !isDispositivoOption(opcao) && isDispositivoWithDate(opcao, campo);
                const handleVariantChange = (v) => {
                  const current = paramValues?.[opcao];
                  if (current?.v !== v) {
                    onParamChange?.(opcao, { v, p: {} });
                  } else {
                    onParamChange?.(opcao, { ...(current || {}), v });
                  }
                };
                const handleNumChange = (val) => {
                  if (isVariant) {
                    const current = paramValues?.[opcao] || {};
                    onParamChange?.(opcao, { ...current, p: val });
                  } else {
                    onParamChange?.(opcao, val);
                  }
                };
                return (
                  <label
                    key={idx}
                    className={`flex flex-col px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 text-sm ${
                      isSelected
                        ? "bg-primary/10 border border-primary/25"
                        : "bg-muted/30 border border-transparent hover:bg-muted/60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggle(opcao)}
                        className="mt-0.5 shrink-0"
                      />
                      <span className={isSelected ? "text-foreground font-medium" : "text-muted-foreground"}>
                        {displayLabel}
                      </span>
                    </div>
                    {isSelected && isVariant && (
                      <div className="ml-7">
                        <VariantInput
                          opcao={opcao}
                          value={variantIdx}
                          onChange={handleVariantChange}
                        />
                      </div>
                    )}
                    {isSelected && hasParam && !isMedicacao && (
                      <div className="ml-7">
                        <ParameterInput
                          opcao={effectiveOption}
                          value={numParamVal}
                          onChange={handleNumChange}
                        />
                      </div>
                    )}
                    {isSelected && opcao === "Presença de lesão por pressão" && (
                      <div className="ml-7">
                        <LesaoPressaoInput
                          value={paramValues?.[opcao]}
                          onChange={(val) => onParamChange?.(opcao, val)}
                        />
                      </div>
                    )}
                    {showDispositivoFull && (
                      <div className="ml-7">
                        <DispositivoInput
                          opcao={opcao}
                          value={paramValues?.[opcao]}
                          onChange={(val) => onParamChange?.(opcao, val)}
                        />
                      </div>
                    )}
                    {showDispositivoDate && (
                      <div className="ml-7">
                        <DispositivoDateInput
                          value={paramValues?.[opcao]}
                          onChange={(val) => onParamChange?.(opcao, val)}
                        />
                      </div>
                    )}
                    {isSelected && isMedicacao && (
                      <div className="ml-7">
                        <MedicacaoInput
                          opcao={opcao}
                          value={paramValues?.[opcao]}
                          onChange={(val) => onParamChange?.(opcao, val)}
                          paramValues={paramValues}
                          onParamChange={onParamChange}
                        />
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
            {isMedicacao && (
              <div className="px-4 pb-4">
                <MedicacaoCustomArea
                  paramValues={paramValues}
                  onParamChange={onParamChange}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
