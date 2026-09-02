import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT = process.env.OUT_DIR;
const BASE = 'http://localhost:3000';

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });

const shot = async (name) => { await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true }); console.log('shot', name); };

// --- Landing ---------------------------------------------------------------
await page.goto(BASE, { waitUntil: 'networkidle' });
await shot('01-landing');

// --- Registrazione ---------------------------------------------------------
const email = `mario.rossi.${Date.now()}@example.com`;
await page.goto(`${BASE}/registrazione`, { waitUntil: 'networkidle' });
await shot('02-registrazione');
await page.fill('#name', 'Mario Rossi');
await page.fill('#email', email);
await page.fill('#password', 'PortaleTalenti1');
await page.fill('#confirmPassword', 'PortaleTalenti1');
await page.click('button[type=submit]');
await page.waitForURL('**/questionario**', { timeout: 20000 });
console.log('registrato ->', page.url());
await shot('03-intro-questionario');

// --- Questionario ----------------------------------------------------------
await page.click('a[href="/questionario?start=1"]');
await page.waitForSelector('fieldset', { timeout: 15000 });
await shot('04-questionario');

// Rispondi a tutti gli item con la tastiera (1-7), profilo "strategico".
let answered = 0;
for (let i = 0; i < 80; i++) {
  const txt = await page.locator('text=/Domanda \\d+ di \\d+/').first().textContent();
  const m = txt.match(/Domanda (\d+) di (\d+)/);
  if (!m) break;
  const total = Number(m[2]);
  const key = String(1 + Math.floor(Math.random() * 7));
  await page.keyboard.press(key);
  answered++;
  await page.waitForTimeout(60);
  const done = await page.locator('text=Hai risposto a tutte').count();
  if (done > 0 || answered >= total) break;
}
console.log('risposte date:', answered);
await page.waitForTimeout(1500);
await shot('05-fine-questionario');

// --- Completamento ---------------------------------------------------------
const finishBtn = page.locator('button', { hasText: /Calcola i miei talenti|Vedi il mio profilo/ }).first();
await finishBtn.click();
await page.waitForURL('**/dashboard**', { timeout: 30000 });
await page.waitForTimeout(1500);
console.log('dashboard ->', page.url());
await shot('06-dashboard');

// Espandi la seconda scheda talento
const cards = page.locator('article button[aria-expanded]');
await cards.nth(1).click();
await page.waitForTimeout(400);
await shot('07-scheda-talento');

// --- PDF -------------------------------------------------------------------
const [download] = await Promise.all([
  page.waitForEvent('download', { timeout: 40000 }),
  page.click('a[href^="/api/report/"]'),
]);
const pdfPath = `${OUT}/report.pdf`;
await download.saveAs(pdfPath);
console.log('pdf salvato:', fs.statSync(pdfPath).size, 'byte');

// --- Mobile ----------------------------------------------------------------
const mob = await ctx.newPage();
await mob.setViewportSize({ width: 390, height: 844 });
await mob.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });
await mob.waitForTimeout(1200);
await mob.screenshot({ path: `${OUT}/08-dashboard-mobile.png`, fullPage: true });
await mob.goto(`${BASE}/questionario?start=1`, { waitUntil: 'networkidle' });
await mob.screenshot({ path: `${OUT}/09-questionario-mobile.png`, fullPage: true });
console.log('shot mobile');

// --- Admin -----------------------------------------------------------------
const admin = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const ap = await admin.newPage();
await ap.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
await ap.fill('#email', 'admin@portaletalenti.it');
await ap.fill('#password', 'Password123');
await ap.click('button[type=submit]');
await ap.waitForURL('**/dashboard**', { timeout: 20000 });
await ap.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
await ap.waitForTimeout(800);
await ap.screenshot({ path: `${OUT}/10-admin-metriche.png`, fullPage: true });
await ap.goto(`${BASE}/admin/utenti`, { waitUntil: 'networkidle' });
await ap.screenshot({ path: `${OUT}/11-admin-utenti.png`, fullPage: true });
await ap.goto(`${BASE}/admin/domande`, { waitUntil: 'networkidle' });
await ap.screenshot({ path: `${OUT}/12-admin-domande.png` });
console.log('admin ok');

// --- Controllo accesso: utente standard su /admin --------------------------
const forbidden = await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
console.log('utente standard su /admin ->', page.url(), forbidden.status());

console.log('\nERRORI JS:', errors.length ? errors : 'nessuno');
await browser.close();
