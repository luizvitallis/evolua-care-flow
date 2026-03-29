import { useState } from "react";
import { ChevronDown } from "lucide-react";

const GRAUS = ["I", "II", "III", "IV", "Não classificável"];
const LOCAIS = [
  "Sacra", "Trocanter D", "Trocanter E",
  "Escápula D", "Escápula E",
  "Calcâneo D", "Calcâneo E",
  "Maléolo D", "Maléolo E",
  "Costas", "Joelho D", "Joelho E",
];

export default function LesaoPressaoInput({ value, onChange }) {
  const lesoes = Array.isArray(value) ? value : [];

  const addLesao = () => {
    onChange([...lesoes, { grau: "I", local: "Sacra" }]);
  };

  const updateLesao = (idx, field, val) => {
    const updated = lesoes.map((l, i) => (i === idx ? { ...l, [field]: val } : l));
    onChange(updated);
  };

  const removeLesao = (idx) => {
    onChange(lesoes.filter((_, i) => i !== idx));
  };

  return (
    <div
      className="flex flex-col gap-2 mt-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      {lesoes.map((lesao, idx) => (
        <div key={idx} className="flex flex-wrap items-center gap-1.5 bg-muted/40 rounded-lg p-2">
          <select
            value={lesao.grau}
            onChange={(e) => updateLesao(idx, "grau", e.target.value)}
            className="text-xs bg-background border border-border rounded-md px-2 py-1.5 text-foreground"
          >
            {GRAUS.map((g) => (
              <option key={g} value={g}>Grau {g}</option>
            ))}
          </select>
          <select
            value={lesao.local}
            onChange={(e) => updateLesao(idx, "local", e.target.value)}
            className="text-xs bg-background border border-border rounded-md px-2 py-1.5 text-foreground"
          >
            {LOCAIS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeLesao(idx); }}
            className="text-xs text-destructive hover:text-destructive/80 font-medium px-1"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addLesao(); }}
        className="text-xs text-primary font-medium hover:underline self-start"
      >
        + Adicionar lesão
      </button>
    </div>
  );
}

export function formatLesaoPressao(lesoes) {
  if (!Array.isArray(lesoes) || lesoes.length === 0) return "Presença de lesão por pressão";
  const items = lesoes.map((l) => `Grau ${l.grau} em ${l.local}`);
  return `Presença de lesão por pressão: ${items.join("; ")}`;
}