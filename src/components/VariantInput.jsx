import { parseVariant } from "../lib/variantUtils";

export default function VariantInput({ opcao, value, onChange }) {
  const parsed = parseVariant(opcao);
  if (!parsed) return null;
  const selected = value ?? 0;

  return (
    <div
      className="flex flex-wrap gap-1.5 mt-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      {parsed.options.map((opt, idx) => {
        const isActive = idx === selected;
        return (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange(idx);
            }}
            className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
              isActive
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "bg-muted hover:bg-primary/10 text-muted-foreground"
            }`}
          >
            {opt.replace(/___/g, "•••")}
          </button>
        );
      })}
    </div>
  );
}
