const BR_TZ = "America/Sao_Paulo";

function brDateParts(date = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: BR_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [y, m, d] = fmt.format(date).split("-").map(Number);
  return { y, m, d };
}

export function parseAdmissionDate(s) {
  if (!s || typeof s !== "string") return null;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  return { y, m: mo, d };
}

export function formatDateBR(s) {
  const p = parseAdmissionDate(s);
  if (!p) return "";
  const dd = String(p.d).padStart(2, "0");
  const mm = String(p.m).padStart(2, "0");
  return `${dd}/${mm}/${p.y}`;
}

export function calcDIH(admissionStr) {
  const adm = parseAdmissionDate(admissionStr);
  if (!adm) return null;
  const today = brDateParts(new Date());
  const admUtc = Date.UTC(adm.y, adm.m - 1, adm.d);
  const todayUtc = Date.UTC(today.y, today.m - 1, today.d);
  const diffDays = Math.floor((todayUtc - admUtc) / 86400000);
  if (diffDays < 0) return null;
  return diffDays + 1;
}

export function nowBR() {
  const dateStr = new Intl.DateTimeFormat("pt-BR", {
    timeZone: BR_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const timeStr = new Intl.DateTimeFormat("pt-BR", {
    timeZone: BR_TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
  return { dateStr, timeStr };
}
