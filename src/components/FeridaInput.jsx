import { Checkbox } from "@/components/ui/checkbox";

const TIPOS = ["Laceração", "Perfuração", "Corte", "Abrasão", "Avulsão", "Contusão"];
const LOCAIS = [
  "Cabeça", "Pescoço", "Tórax", "Abdome",
  "MSD", "MSE", "Região genital", "Nádegas",
  "MID", "MIE",
];

export default function FeridaInput({ value, onChange }) {
  const feridas = Array.isArray(value) ? value : [];

  const addFerida = () => {
    onChange([...feridas, { tipo: TIPOS[0], locais: [] }]);
  };

  const updateTipo = (idx, tipo) => {
    onChange(feridas.map((f, i) => (i === idx ? { ...f, tipo } : f)));
  };

  const toggleLocal = (idx, local) => {
    onChange(
      feridas.map((f, i) => {
        if (i !== idx) return f;
        const locais = Array.isArray(f.locais) ? f.locais : [];
        const exists = locais.includes(local);
        return { ...f, locais: exists ? locais.filter((l) => l !== local) : [...locais, local] };
      })
    );
  };

  const removeFerida = (idx) => {
    onChange(feridas.filter((_, i) => i !== idx));
  };

  return (
    <div
      className="flex flex-col gap-2 mt-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      {feridas.map((ferida, idx) => (
        <div key={idx} className="flex flex-col gap-2 bg-muted/40 rounded-lg p-2">
          <div className="flex items-center gap-1.5">
            <select
              value={ferida.tipo}
              onChange={(e) => updateTipo(idx, e.target.value)}
              className="text-xs bg-background border border-border rounded-md px-2 py-1.5 text-foreground"
            >
              {TIPOS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFerida(idx); }}
              className="text-xs text-destructive hover:text-destructive/80 font-medium px-1 ml-auto"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {LOCAIS.map((l) => {
              const checked = Array.isArray(ferida.locais) && ferida.locais.includes(l);
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
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addFerida(); }}
        className="text-xs text-primary font-medium hover:underline self-start"
      >
        + Adicionar ferida
      </button>
    </div>
  );
}

export function formatFerida(feridas) {
  if (!Array.isArray(feridas) || feridas.length === 0) return "Ferida";
  const items = feridas.map((f) => {
    const locais = Array.isArray(f.locais) ? f.locais : [];
    const tipo = (f.tipo || "").toLowerCase();
    if (locais.length === 0) return `Ferida ${tipo}`.trim();
    return `Ferida ${tipo} em ${locais.join(", ")}`.trim();
  });
  return items.join("; ");
}
