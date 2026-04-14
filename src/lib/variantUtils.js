export function hasVariant(opcao) {
  return /\{[^{}]+\}/.test(opcao || "");
}

export function parseVariant(opcao) {
  if (!opcao) return null;
  const m = opcao.match(/\{([^{}]+)\}/);
  if (!m) return null;
  const options = m[1].split("|").map((s) => s.trim()).filter(Boolean);
  return {
    options,
    index: m.index,
    full: m[0],
  };
}

export function fillVariant(opcao, variantIdx) {
  const parsed = parseVariant(opcao);
  if (!parsed) return opcao;
  const idx = Math.max(0, Math.min(parsed.options.length - 1, variantIdx ?? 0));
  const chosen = parsed.options[idx] ?? "";
  return opcao.slice(0, parsed.index) + chosen + opcao.slice(parsed.index + parsed.full.length);
}
