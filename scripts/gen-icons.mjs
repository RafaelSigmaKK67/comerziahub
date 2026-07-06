// Gera os ícones PNG do PWA (public/icon-*.png) a partir de app/icon.svg,
// usando o Chrome do sistema via Puppeteer (não há ferramenta de imagem no PATH).
import puppeteer from "puppeteer-core";
import { readFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd());
const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);
const CHROME = CANDIDATES.find((p) => existsSync(p));
const svg = readFileSync(path.join(ROOT, "app", "icon.svg"), "utf8");

// Versão "maskable": sem cantos arredondados (o launcher aplica a máscara)
// e com o desenho dentro da zona segura (80% centrais).
const svgMaskable = svg
  .replace('rx="8"', 'rx="0"')
  .replace(
    /<path d="M10 12h12/,
    '<g transform="translate(16 16) scale(0.8) translate(-16 -16)"><path d="M10 12h12'
  )
  .replace("</svg>", "</g></svg>");

mkdirSync(path.join(ROOT, "public"), { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
const page = await browser.newPage();

async function render(markup, size, out) {
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
  await page.setContent(
    `<!doctype html><style>*{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${markup}`
  );
  await page.screenshot({ path: path.join(ROOT, "public", out), omitBackground: true });
  console.log("gerado:", out);
}

await render(svg, 192, "icon-192.png");
await render(svg, 512, "icon-512.png");
await render(svgMaskable, 512, "icon-512-maskable.png");
await browser.close();
