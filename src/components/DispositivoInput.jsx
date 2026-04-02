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

// All dispositivo options that should show a date input (including those without location config)
const ALL_DISPOSITIVO_NAMES = [
  ...Object.keys(DISPOSITIVO_CONFIG),
  "Sonda vesical de demora com diurese clara",
  "Sonda nasoentérica em posição",
  "Acesso venoso central sem sinais de infecção",
  "Acesso venoso central pérvio, sem sinais de infecção",
  "Acesso venoso central — sem sinais de infecção",
  "SVD pérvio",
  "Cateter arterial",
  "Cateter arterial pérvio",
  "Dreno",
  "Dreno torácico oscilante",
  "Dreno torácico — oscilante / sem borbulhamento",
  "Sonda vesical de demora",
];

export function isDispositivoOption(opcao) {
  return opcao in DISPOSITIVO_CONFIG;
}

export function isDispositivoWithDate(opcao, campo) {
  return campo === "dispositivos" || ALL_DISPOSITIVO_NAMES.includes(opcao) || opcao in DISPOSITIVO_CONFIG;
}

function parseValue(value) {
  if (!value) return { local: "", data: "" };
  if (typeof value === "string") return { local: value, data: "" };
  return { local: value.local || "", data: value.data || "" };
}

export function formatDispositivo(opcao, value) {
  const { local, data } = parseValue(value);
  let text = opcao;
  if (local) text += ` em ${local}`;
  if (data) {
    const d = new Date(data + "T00:00:00");
    text += ` (${d.toLocaleDateString("pt-BR")})`;
  }
  return text;
}

export function DispositivoDateInput({ value, onChange }) {
  const parsed = parseValue(value);

  return (
    <div
      className="flex items-center gap-2 mt-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="text-xs text-muted-foreground font-medium">Data:</span>
      <input
        type="date"
        value={parsed.data}
        onChange={(e) => {
          e.stopPropagation();
          onChange({ ...parsed, data: e.target.value });
        }}
        onClick={(e) => e.stopPropagation()}
        className="text-xs bg-background border border-border rounded-md px-2 py-1.5 text-foreground"
      />
    </div>
  );
}

export default function DispositivoInput({ opcao, value, onChange }) {
  const config = DISPOSITIVO_CONFIG[opcao];
  const parsed = parseValue(value);

  const updateField = (field, val) => {
    onChange({ ...parsed, [field]: val });
  };

  return (
    <div
      className="flex flex-col gap-1.5 mt-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      {config && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Local:</span>
          <select
            value={parsed.local}
            onChange={(e) => updateField("local", e.target.value)}
            className="text-xs bg-background border border-border rounded-md px-2 py-1.5 text-foreground flex-1"
          >
            <option value="">Selecionar...</option>
            {config.locais.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium">Data:</span>
        <input
          type="date"
          value={parsed.data}
          onChange={(e) => updateField("data", e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="text-xs bg-background border border-border rounded-md px-2 py-1.5 text-foreground"
        />
      </div>
    </div>
  );
}
