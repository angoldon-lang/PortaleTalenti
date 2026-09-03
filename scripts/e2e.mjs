/**
 * Smoke test end-to-end del portale. Richiede il server avviato su :3000 e il
 * database popolato (npm run db:seed).
 *
 *   CHROMIUM_PATH=/percorso/chromium OUT_DIR=./shots node scripts/e2e.mjs
 *
 * Copre: registrazione, compilazione di un questionario, report con la lente
 * corretta, export PDF, funzioni di amministrazione e controlli di accesso.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const OUT = process.env.OUT_DIR ?? './shots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
const page = await ctx.newPage();

const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });

const shot = async (name) => {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log('  shot', name);
};
// Nell'header dell'app c'è un altro button[type=submit] ("Esci"): restringere
// sempre al contenuto principale, altrimenti il test fa logout invece di inviare.
const submit = (p) => p.locator('main button[type=submit]').first().click();

const failures = [];
const check = (label, actual, expected) => {
  const ok = actual === expected;
  console.log(`  ${ok ? '✓' : '✗'} ${label}: ${actual}${ok ? '' : ` (atteso ${expected})`}`);
  if (!ok) failures.push(label);
};

// --- 1. Registrazione -------------------------------------------------------
console.log('\n1. Registrazione');
const email = `e2e.${Date.now()}@example.com`;
await page.goto(`${BASE}/registrazione`, { waitUntil: 'networkidle' });
await page.fill('#name', 'Utente E2E');
await page.fill('#email', email);
await page.fill('#password', 'PortaleTalenti1');
await page.fill('#confirmPassword', 'PortaleTalenti1');
await submit(page);
await page.waitForURL('**/questionario**', { timeout: 30000 });
await shot('01-questionari');

// --- 2. Compilazione --------------------------------------------------------
const slug = process.env.ASSESSMENT ?? 'core12';
console.log(`\n2. Compilazione "${slug}"`);
await page.goto(`${BASE}/questionario/${slug}?start=1`, { waitUntil: 'networkidle' });
await page.waitForSelector('fieldset', { timeout: 30000 });
await shot('02-item');

let total = 0;
for (let i = 0; i < 400; i++) {
  const text = await page.getByText(/Domanda \d+ di \d+/).first().textContent();
  const m = text.match(/Domanda (\d+) di (\d+)/);
  if (!m) break;
  total = Number(m[2]);
  const last = Number(m[1]) === total;
  await page.keyboard.press(last ? '4' : String(1 + Math.floor(Math.random() * 7)));
  await page.waitForTimeout(last ? 150 : 30);
  if (last && i > 0) break;
}
console.log(`  ${total} item`);
await page.waitForTimeout(2500);
await page.locator('button', { hasText: /Calcola i miei talenti|Vedi il mio profilo/ }).first().click();
await page.waitForURL('**/dashboard**', { timeout: 120000 });
await shot('03-dashboard');

// --- 3. Report e PDF --------------------------------------------------------
console.log('\n3. Report');
const href = await page.locator('a[href^="/report/"]').first().getAttribute('href');
await page.goto(BASE + href, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await shot('04-report');
const ownReportId = href.split('/').pop();
check('schede talento presenti', (await page.locator('article button[aria-expanded]').count()) > 0, true);

const [pdf] = await Promise.all([
  page.waitForEvent('download', { timeout: 120000 }),
  page.click('a[href^="/api/report/"]'),
]);
await pdf.saveAs(`${OUT}/report.pdf`);
console.log('  PDF scaricato');

// --- 4. Amministrazione -----------------------------------------------------
console.log('\n4. Amministrazione');
const admin = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
const ap = await admin.newPage();
await ap.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
await ap.fill('#email', process.env.ADMIN_EMAIL ?? 'admin@portaletalenti.it');
await ap.fill('#password', process.env.ADMIN_PASSWORD ?? 'Password123');
await ap.locator('main button[type=submit]').first().click();
await ap.waitForURL('**/dashboard**', { timeout: 30000 });

await ap.goto(`${BASE}/admin/nuovo-utente`, { waitUntil: 'networkidle' });
const created = `creato.${Date.now()}@example.com`;
await ap.fill('#name', 'Utente Creato');
await ap.fill('#email', created);
await ap.locator('form').filter({ hasText: 'Crea utente' }).locator('button[type=submit]').click();
await ap.waitForSelector('text=Utente creato', { timeout: 20000 });
const tempPassword = (await ap.locator('.font-mono').first().textContent()).trim();
check('password temporanea nel formato atteso', /^[A-Za-z0-9]{4}(-[A-Za-z0-9]{4}){3}$/.test(tempPassword), true);
await ap.screenshot({ path: `${OUT}/05-utente-creato.png`, fullPage: true });

// l'account creato deve poter accedere davvero
const fresh = await browser.newContext();
const fp = await fresh.newPage();
await fp.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
await fp.fill('#email', created);
await fp.fill('#password', tempPassword);
await fp.locator('main button[type=submit]').first().click();
await fp.waitForURL('**/dashboard**', { timeout: 30000 });
check('accesso del nuovo utente', fp.url().includes('/dashboard'), true);
await fresh.close();

await ap.goto(`${BASE}/admin/report`, { waitUntil: 'networkidle' });
await ap.screenshot({ path: `${OUT}/06-admin-report.png`, fullPage: true });
const [adminPdf] = await Promise.all([
  ap.waitForEvent('download', { timeout: 120000 }),
  ap.locator('a[href^="/api/report/"]').first().click(),
]);
await adminPdf.saveAs(`${OUT}/report-admin.pdf`);
console.log('  PDF di un altro utente scaricato');

const [csv] = await Promise.all([
  ap.waitForEvent('download', { timeout: 60000 }),
  ap.click('a[href="/api/admin/export"]'),
]);
await csv.saveAs(`${OUT}/risultati.csv`);
console.log('  CSV esportato');

await ap.goto(`${BASE}/admin/report`, { waitUntil: 'networkidle' });
const auditEntries = await ap.locator('section[aria-labelledby=tracciato] li').count();
check('accessi registrati nel tracciato', auditEntries > 0, true);

// --- 5. Controlli di accesso ------------------------------------------------
console.log('\n5. Controlli di accesso');
const own = await page.request.get(`${BASE}/api/report/${ownReportId}/pdf`);
check('il proprietario scarica il proprio report', own.status(), 200);

const guest = await browser.newContext();
const gp = await guest.newPage();
const anonymous = await gp.request.get(`${BASE}/api/report/${ownReportId}/pdf`);
check('anonimo sul PDF di un report', anonymous.status(), 401);
await gp.goto(`${BASE}/admin`);
check('anonimo su /admin viene respinto', gp.url().includes('/login'), true);
await guest.close();

const demo = await browser.newContext();
const dp = await demo.newPage();
await dp.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
await dp.fill('#email', 'demo@portaletalenti.it');
await dp.fill('#password', 'Password123');
await dp.locator('main button[type=submit]').first().click();
await dp.waitForURL('**/dashboard**', { timeout: 30000 });
const foreign = await dp.request.get(`${BASE}/api/report/${ownReportId}/pdf`);
check('utente standard sul report altrui', foreign.status(), 404);
await dp.goto(`${BASE}/admin/report`);
check('utente standard su /admin/report', dp.url().endsWith('/dashboard'), true);
const exportAttempt = await dp.request.get(`${BASE}/api/admin/export`);
check('utente standard sull’export CSV', exportAttempt.status(), 403);
await demo.close();

// --- Esito ------------------------------------------------------------------
console.log('\nErrori JavaScript:', errors.length ? errors.slice(0, 5) : 'nessuno');
await browser.close();

if (failures.length || errors.length) {
  console.error('\n✗ Smoke test fallito:', [...failures, ...errors.slice(0, 3)].join(' | '));
  process.exit(1);
}
console.log('\n✓ Smoke test superato.');
