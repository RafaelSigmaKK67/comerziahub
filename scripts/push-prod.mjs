// Aplica schema + seed no banco de PRODUÇÃO, lendo a DATABASE_URL da Vercel
// (sem expor a senha). Uso: VERCEL_TOKEN=... node scripts/push-prod.mjs
import { execSync } from "node:child_process";

const TEAM = "team_v07nKPuFqfcvpnfQ6bqlCtLz";
const PROJ = "prj_irmBb9awkbSAQFMwIIwADCdHTPfo";
const token = process.env.VERCEL_TOKEN;
if (!token) {
  console.error("Falta VERCEL_TOKEN");
  process.exit(1);
}

const headers = { Authorization: `Bearer ${token}` };
const base = "https://api.vercel.com";

const list = await (
  await fetch(`${base}/v9/projects/${PROJ}/env?teamId=${TEAM}`, { headers })
).json();
const meta = (list.envs ?? []).find((e) => e.key === "DATABASE_URL");
if (!meta) {
  console.error("DATABASE_URL não encontrada na Vercel.");
  process.exit(1);
}
// O valor decifrado vem do endpoint de item único.
const single = await (
  await fetch(`${base}/v9/projects/${PROJ}/env/${meta.id}?teamId=${TEAM}`, { headers })
).json();
const url = single.value;
if (!url || !url.startsWith("mysql")) {
  console.error("Não consegui obter a DATABASE_URL decifrada (valor:", String(url).slice(0, 12), "...)");
  process.exit(1);
}

const env = { ...process.env, DATABASE_URL: url };

function run(label, cmd) {
  console.log(`→ ${label}`);
  try {
    console.log(execSync(cmd, { env, encoding: "utf8" }));
  } catch (e) {
    console.error(`FALHOU: ${label}`);
    console.error(e.stdout || "");
    console.error(e.stderr || "");
    process.exit(1);
  }
}

run("prisma db push (Aiven)", "npx prisma db push --skip-generate --accept-data-loss");
run("seed (Aiven)", "npx tsx prisma/seed.ts");
console.log("✔ produção (Aiven) atualizada");
