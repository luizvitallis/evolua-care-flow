import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import ParameterInput, { hasParameter } from "./ParameterInput";
import LesaoPressaoInput from "./LesaoPressaoInput";
import DispositivoInput, { isDispositivoOption } from "./DispositivoInput";
import { adaptGender } from "../lib/genderUtils";

export default function CheckboxGroup({ titulo, opcoes, selected, onToggle, paramValues, onParamChange, sexo }) {
  const [expanded, setExpanded] = useState(true);
  const count = selected.length;

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
                const hasParam = hasParameter(opcao);
                const displayLabel = adaptGender(opcao.replace(/___\/4\+/g, "+/4+").replace(/___/g, "•••"), sexo);
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
                    {isSelected && hasParam && (
                      <div className="ml-7">
                        <ParameterInput
                          opcao={opcao}
                          value={paramValues?.[opcao]}
                          onChange={(val) => onParamChange?.(opcao, val)}
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
                    {isSelected && isDispositivoOption(opcao) && (
                      <div className="ml-7">
                        <DispositivoInput
                          opcao={opcao}
                          value={paramValues?.[opcao]}
                          onChange={(val) => onParamChange?.(opcao, val)}
                        />
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}