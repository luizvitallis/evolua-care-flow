// Map of masculine → feminine word replacements for Portuguese medical terms
const genderReplacements = [
  // -ado → -ada
  [/\bcorado\b/gi, "corada"],
  [/\bhidratado\b/gi, "hidratada"],
  [/\bdescorado\b/gi, "descorada"],
  [/\bdesidratado\b/gi, "desidratada"],
  [/\bsedado\b/gi, "sedada"],
  [/\banalgesiado\b/gi, "analgesiada"],
  [/\borientado\b/gi, "orientada"],
  [/\bdesorientado\b/gi, "desorientada"],
  [/\bagitado\b/gi, "agitada"],
  // -ico → -ica
  [/\bdispneico\b/gi, "dispneica"],
  [/\btaquipneico\b/gi, "taquipneica"],
  [/\beupneico\b/gi, "eupneica"],
  [/\bbradicárdico\b/gi, "bradicárdica"],
  [/\btaquicárdico\b/gi, "taquicárdica"],
  [/\bacianótico\b/gi, "acianótica"],
  [/\banictérico\b/gi, "anictérica"],
  [/\bictérico\b/gi, "ictérica"],
  [/\banúrico\b/gi, "anúrica"],
  // -ivo → -iva
  [/\bcolaborativo\b/gi, "colaborativa"],
  [/\bresponsivo\b/gi, "responsiva"],
  // -oso → -osa
  [/\bconfuso\b/gi, "confusa"],
  // -ido → -ida
  [/\blúcido\b/gi, "lúcida"],
  // -nte (consciente, presente) - sem gênero, mantém
];

/**
 * Adapts medical text to feminine gender.
 * If sexo is "feminino", replaces masculine terms with feminine equivalents.
 * Otherwise returns text unchanged.
 */
export function adaptGender(text, sexo) {
  if (sexo !== "feminino") return text;
  let result = text;
  for (const [pattern, replacement] of genderReplacements) {
    result = result.replace(pattern, (match) => {
      // Preserve original capitalization
      if (match[0] === match[0].toUpperCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }
  return result;
}
