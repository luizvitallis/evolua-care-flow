const TIPOS = [
  "Penrose",
  "Hehr",
  "Pezzer",
  "Portovac",
  "Jackson-Pratt",
  "Hemovac",
  "Blake",
  "Tórax com selo d'água",
];

const ASPECTOS = ["Aberto", "Fechado"];

export default function DrenoInput({ value, onChange }) {
  const drenos = Array.isArray(value) ? value : [];

  const addDreno = () => {
    onChange([...drenos, { tipo: TIPOS[0], aspecto: ASPECTOS[0], localizacao: "" }]);
  };

  const updateField = (idx, field, val) => {
    onChange(drenos.map((d, i) => (i === idx ? { ...d, [field]: val } : d)));
  };

  const removeDreno = (idx) => {
    onChange(drenos.filter((_, i) => i !== idx));
  };

  return (
    <div
      className="flex flex-col gap-2 mt-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      {drenos.map((dreno, idx) => (
        <div key={idx} className="flex flex-col gap-1.5 bg-muted/40 rounded-lg p-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <select
              value={dreno.tipo}
              onChange={(e) => updateField(idx, "tipo", e.target.value)}
              className="text-xs bg-background border border-border rounded-md px-2 py-1.5 text-foreground"
            >
              {TIPOS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <div className="flex rounded-lg overflow-hidden border border-border/60">
              {ASPECTOS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateField(idx, "aspecto", a); }}
                  className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                    dreno.aspecto === a
                      ? "bg-primary text-white"
                      : "bg-background text-muted-foreground hover:bg-muted/60"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeDreno(idx); }}
              className="text-xs text-destructive hover:text-destructive/80 font-medium px-1 ml-auto"
            >
              ✕
            </button>
          </div>
          <input
            type="text"
            placeholder="Localização (ex.: hemitórax D, FID, abdome)"
            value={dreno.localizacao || ""}
            onChange={(e) => { e.stopPropagation(); updateField(idx, "localizacao", e.target.value); }}
            onClick={(e) => e.stopPropagation()}
            className="text-xs bg-background border border-border rounded-md px-2 py-1.5 text-foreground"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addDreno(); }}
        className="text-xs text-primary font-medium hover:underline self-start"
      >
        + Adicionar dreno
      </button>
    </div>
  );
}

export function formatDreno(drenos) {
  if (!Array.isArray(drenos) || drenos.length === 0) return "Dreno";
  const items = drenos.map((d) => {
    const tipo = d.tipo || "";
    const aspecto = (d.aspecto || "").toLowerCase();
    const local = (d.localizacao || "").trim();
    let text = `Dreno ${tipo}`.trim();
    if (aspecto) text += ` ${aspecto}`;
    if (local) text += ` em ${local}`;
    return text;
  });
  return items.join("; ");
}
