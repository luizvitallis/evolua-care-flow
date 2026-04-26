import { Checkbox } from "@/components/ui/checkbox";

const GRAUS = ["1° grau", "2° grau", "3° grau"];
const LOCAIS = [
  "Cabeça", "Pescoço", "Tórax", "Abdome",
  "MSD", "MSE", "Região genital", "Nádegas",
  "MID", "MIE",
];

export default function QueimaduraInput({ value, onChange }) {
  const queimaduras = Array.isArray(value) ? value : [];

  const addQueimadura = () => {
    onChange([...queimaduras, { grau: GRAUS[0], locais: [] }]);
  };

  const updateGrau = (idx, grau) => {
    onChange(queimaduras.map((q, i) => (i === idx ? { ...q, grau } : q)));
  };

  const toggleLocal = (idx, local) => {
    onChange(
      queimaduras.map((q, i) => {
        if (i !== idx) return q;
        const locais = Array.isArray(q.locais) ? q.locais : [];
        const exists = locais.includes(local);
        return { ...q, locais: exists ? locais.filter((l) => l !== local) : [...locais, local] };
      })
    );
  };

  const removeQueimadura = (idx) => {
    onChange(queimaduras.filter((_, i) => i !== idx));
  };

  return (
    <div
      className="flex flex-col gap-2 mt-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      {queimaduras.map((queimadura, idx) => (
        <div key={idx} className="flex flex-col gap-2 bg-muted/40 rounded-lg p-2">
          <div className="flex items-center gap-1.5">
            <select
              value={queimadura.grau}
              onChange={(e) => updateGrau(idx, e.target.value)}
              className="text-xs bg-background border border-border rounded-md px-2 py-1.5 text-foreground"
            >
              {GRAUS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeQueimadura(idx); }}
              className="text-xs text-destructive hover:text-destructive/80 font-medium px-1 ml-auto"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {LOCAIS.map((l) => {
              const checked = Array.isArray(queimadura.locais) && queimadura.locais.includes(l);
              return (
                <label key={l} className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleLocal(idx, l)}
                    className="shrink-0"
                  />
                  <span className={checked ? "text-foreground font-medium" : "text-muted-foreground"}>{l}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addQueimadura(); }}
        className="text-xs text-primary font-medium hover:underline self-start"
      >
        + Adicionar queimadura
      </button>
    </div>
  );
}

export function formatQueimadura(queimaduras) {
  if (!Array.isArray(queimaduras) || queimaduras.length === 0) return "Queimadura";
  const items = queimaduras.map((q) => {
    const locais = Array.isArray(q.locais) ? q.locais : [];
    const grau = q.grau || "";
    if (locais.length === 0) return `Queimadura ${grau}`.trim();
    return `Queimadura ${grau} em ${locais.join(", ")}`.trim();
  });
  return items.join("; ");
}
