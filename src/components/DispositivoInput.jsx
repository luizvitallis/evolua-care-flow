import { useState } from "react";

const LOCAIS_AVP = [
  "MSE", "MSD", "MIE", "MID", "Dorso da mão E", "Dorso da mão D",
  "Fossa cubital E", "Fossa cubital D", "Antebraço E", "Antebraço D",
];

const LOCAIS_CVC = [
  "Jugular interna D", "Jugular interna E",
  "Subclávia D", "Subclávia E",
  "Femoral D", "Femoral E",
];

const LOCAIS_CATETER_HD = [
  "Jugular interna D", "Jugular interna E",
  "Subclávia D", "Subclávia E",
  "Femoral D", "Femoral E",
];

const LOCAIS_PICC = [
  "Basílica D", "Basílica E",
  "Cefálica D", "Cefálica E",
  "Braquial D", "Braquial E",
];

const LOCAIS_PERMCATH = [
  "Jugular interna D", "Jugular interna E",
  "Subclávia D", "Subclávia E",
];

const DISPOSITIVO_CONFIG = {
  "AVP pérvio, sem sinais flogísticos": { locais: LOCAIS_AVP },
  "AVP pérvio, com sinais flogísticos": { locais: LOCAIS_AVP },
  "CVC sem sinais flogísticos": { locais: LOCAIS_CVC },
  "CVC com sinais flogísticos": { locais: LOCAIS_CVC },
  "Cateter de hemodiálise sem sinais flogísticos": { locais: LOCAIS_CATETER_HD },
  "Cateter de hemodiálise com sinais flogísticos": { locais: LOCAIS_CATETER_HD },
  "PICC sem sinais flogísticos": { locais: LOCAIS_PICC },
  "PICC com sinais flogísticos": { locais: LOCAIS_PICC },
  "Permcath sem sinais flogísticos": { locais: LOCAIS_PERMCATH },
  "Permcath com sinais flogísticos": { locais: LOCAIS_PERMCATH },
};

export function isDispositivoOption(opcao) {
  return opcao in DISPOSITIVO_CONFIG;
}

export function formatDispositivo(opcao, local) {
  if (!local) return opcao;
  return `${opcao} em ${local}`;
}

export default function DispositivoInput({ opcao, value, onChange }) {
  const config = DISPOSITIVO_CONFIG[opcao];
  if (!config) return null;

  return (
    <div
      className="flex flex-col gap-1.5 mt-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium">Local:</span>
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="text-xs bg-background border border-border rounded-md px-2 py-1.5 text-foreground flex-1"
        >
          <option value="">Selecionar...</option>
          {config.locais.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>
    </div>
  );
}