// Captura screenshots reais do app rodando (XAMPP/MySQL) com Puppeteer.
// Uso: npm run dev (em outro terminal) e depois: node scripts/screenshots.mjs
import puppeteer from "puppeteer";
import { mkdirSync, existsSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:3000";
const OUT = "screenshots";
mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Usa o Chrome/Edge instalados (permitidos pela política do Windows),
// já que o Chromium baixado pelo Puppeteer pode ser bloqueado.
const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);
const executablePath = CANDIDATES.find((p) => existsSync(p));

const browser = await puppeteer.launch({
  headless: "new",
  executablePath,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
page.setDefaultNavigationTimeout(60000);
await page.setViewport({ width: 1440, height: 900 });

async function shot(name, path, wait = 1700) {
  try {
    await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    await sleep(wait);
    await page.screenshot({ path: `${OUT}/${name}` });
    console.log("  ✓", name);
  } catch (e) {
    console.log("  ✗", name, e.message);
  }
}

async function login(email) {
  const client = await page.createCDPSession();
  await client.send("Network.clearBrowserCookies");
  await page.goto(BASE + "/login", { waitUntil: "domcontentloaded" });
  await sleep(1500);
  await page.type("#email", email, { delay: 12 });
  await page.type("#password", "senha123", { delay: 12 });
  await page.click('button[type="submit"]');
  await sleep(3500); // aguarda server action + cookie de sessão
  console.log("  → login", email);
}

console.log("PÚBLICO");
await shot("01-home.png", "/");
await shot("02-login.png", "/login");
await shot("03-register.png", "/register");
await shot("04-marketplace.png", "/marketplace");
await shot("05-store-page.png", "/store/lanchonete-sabor");

// descobre um produto para a página de produto e o carrinho
await page.goto(BASE + "/marketplace", { waitUntil: "domcontentloaded" });
await sleep(1500);
const productHref = await page
  .$eval('a[href^="/product/"]', (a) => a.getAttribute("href"))
  .catch(() => null);
if (productHref) await shot("06-product-page.png", productHref, 2000);
await shot("10-social-feed.png", "/feed");
await shot("09-order-tracking.png", "/orders/CMZ-DEMO01");

console.log("ADMIN");
await login("admin@comerziahub.com");
await shot("11-admin-dashboard.png", "/admin");
await shot("12-admin-stores.png", "/admin/stores");
await shot("13-admin-users.png", "/admin/users");

console.log("LOJA");
await login("loja@comerziahub.com");
await shot("14-store-dashboard.png", "/dashboard");
await shot("15-store-products.png", "/dashboard/products");
await shot("16-store-inventory.png", "/dashboard/inventory");
await shot("17-store-cashback.png", "/dashboard/cashback");

console.log("CLIENTE");
await login("cliente@comerziahub.com");
await shot("18-customer-account.png", "/account");
await shot("19-customer-cashback.png", "/account/cashback");
await shot("20-loyalty-badges.png", "/account/loyalty");
await shot("21-messages.png", "/account/messages");
await shot("24-settings.png", "/account/settings");
// adiciona item ao carrinho e captura carrinho + checkout
if (productHref) {
  await page.goto(BASE + productHref, { waitUntil: "domcontentloaded" });
  await sleep(2000);
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) =>
      /adicionar/i.test(x.textContent || ""),
    );
    if (b) b.click();
  });
  await sleep(2200);
}
await shot("07-cart.png", "/cart");
await shot("08-checkout.png", "/checkout");

console.log("ENTREGADOR");
await login("entregador@comerziahub.com");
await shot("22-courier-dashboard.png", "/courier");
await shot("23-courier-deliveries.png", "/courier/deliveries");

console.log("EXTRAS (mobile escuro + tema claro)");
// Mobile (tema escuro padrão — garante que não há preferência salva)
await page.evaluate(() => {
  try {
    localStorage.removeItem("theme");
  } catch {}
});
await page.setViewport({ width: 390, height: 844 });
await shot("26-home-mobile.png", "/");
// Tema claro (desktop)
await page.setViewport({ width: 1440, height: 900 });
await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
await sleep(1000);
await page.evaluate(() => {
  try {
    localStorage.setItem("theme", "light");
  } catch {}
});
await page.reload({ waitUntil: "domcontentloaded" });
await sleep(1400);
await page.screenshot({ path: `${OUT}/25-home-light.png` });
console.log("  ✓ 25-home-light.png");

await browser.close();
console.log("Concluído.");
