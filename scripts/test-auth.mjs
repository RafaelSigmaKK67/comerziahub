// Testa cadastro + login de ponta a ponta e reporta erros de console/rede/500.
import puppeteer from "puppeteer";
import { existsSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:3000";
const exec = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ headless: "new", executablePath: exec, args: ["--no-sandbox"] });
const page = await browser.newPage();
const errs = [];
page.on("console", (m) => { if (m.type() === "error") errs.push("CONSOLE " + m.text()); });
page.on("pageerror", (e) => errs.push("PAGEERROR " + e.message));
page.on("requestfailed", (r) => errs.push("REQFAIL " + r.url() + " :: " + (r.failure()?.errorText || "")));
page.on("response", (r) => { if (r.status() >= 500) errs.push("HTTP" + r.status() + " " + r.url()); });

const email = "novo_" + Date.now() + "@teste.com";

console.log("== CADASTRO ==", email);
await page.goto(BASE + "/register", { waitUntil: "domcontentloaded" });
await sleep(1500);
await page.type("#name", "Usuario Teste");
await page.type("#email", email);
await page.type("#password", "senha123");
await page.click('button[type="submit"]');
await sleep(4500);
console.log("URL após cadastro:", page.url());
let sess = await page.evaluate(async () => { try { const r = await fetch("/api/auth/session"); return await r.json(); } catch (e) { return { fetchError: String(e) }; } });
console.log("Sessão após cadastro:", JSON.stringify(sess));

// limpa cookies e testa LOGIN com a conta nova
const client = await page.createCDPSession();
await client.send("Network.clearBrowserCookies");
console.log("== LOGIN (conta nova) ==");
await page.goto(BASE + "/login", { waitUntil: "domcontentloaded" });
await sleep(1200);
await page.type("#email", email);
await page.type("#password", "senha123");
await page.click('button[type="submit"]');
await sleep(4000);
console.log("URL após login:", page.url());
sess = await page.evaluate(async () => { try { const r = await fetch("/api/auth/session"); return await r.json(); } catch (e) { return { fetchError: String(e) }; } });
console.log("Sessão após login:", JSON.stringify(sess));

// login com seed
await client.send("Network.clearBrowserCookies");
console.log("== LOGIN (seed admin) ==");
await page.goto(BASE + "/login", { waitUntil: "domcontentloaded" });
await sleep(1000);
await page.type("#email", "admin@comerziahub.com");
await page.type("#password", "senha123");
await page.click('button[type="submit"]');
await sleep(4000);
console.log("URL após login admin:", page.url());

console.log("== ERROS ==", errs.length ? JSON.stringify(errs, null, 2) : "(nenhum)");
await browser.close();
