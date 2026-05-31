// Lê a DATABASE_URL do .env e grava na Vercel (sem expor a senha no chat).
// Uso: VERCEL_TOKEN=... node scripts/sync-prod-db.mjs
import { readFileSync } from "node:fs";

const TEAM = "team_v07nKPuFqfcvpnfQ6bqlCtLz";
const PROJ = "prj_irmBb9awkbSAQFMwIIwADCdHTPfo";
const token = process.env.VERCEL_TOKEN;
if (!token) { console.error("Falta VERCEL_TOKEN"); process.exit(1); }

const env = readFileSync(".env", "utf8");
const m = env.match(/^\s*DATABASE_URL\s*=\s*"?([^"\r\n]+)"?/m);
let url = m?.[1]?.trim();
if (!url || url.includes("COLE_A_SENHA")) {
  console.error("Preencha a senha do Aiven no .env primeiro.");
  process.exit(1);
}
if (!url.includes("aivencloud")) {
  console.error("A DATABASE_URL ativa no .env não é do Aiven (é local?). Ative a linha do Aiven.");
  process.exit(1);
}
// normaliza SSL para o Prisma
url = url.replace(/([?&])ssl-mode=REQUIRED/gi, "$1").replace(/[?&]+$/, "");
if (!/sslaccept=/i.test(url)) url += (url.includes("?") ? "&" : "?") + "sslaccept=accept_invalid_certs";

const base = "https://api.vercel.com";
const h = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

const list = await (await fetch(`${base}/v9/projects/${PROJ}/env?teamId=${TEAM}`, { headers: h })).json();
for (const e of list.envs ?? []) {
  if (e.key === "DATABASE_URL") {
    const d = await fetch(`${base}/v9/projects/${PROJ}/env/${e.id}?teamId=${TEAM}`, { method: "DELETE", headers: h });
    console.log("removida DATABASE_URL antiga:", d.status);
  }
}
const res = await fetch(`${base}/v10/projects/${PROJ}/env?teamId=${TEAM}`, {
  method: "POST",
  headers: h,
  body: JSON.stringify({ key: "DATABASE_URL", value: url, type: "encrypted", target: ["production", "preview", "development"] }),
});
console.log("DATABASE_URL gravada na Vercel:", res.status);
if (res.status >= 300) console.log(await res.text());
