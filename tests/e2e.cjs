const { chromium } = require('playwright');
const FILE = 'file://' + process.cwd() + '/dist/_preview.html';
const out = [];
const log = (...a) => out.push(a.join(' '));
async function opt(p, fid){ await p.click(`[data-fid="${fid}"]`); }
async function cont(p){ await p.click('#nextBtn'); await p.waitForTimeout(80); }
async function run(width, scenario){
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width, height: 860 }, hasTouch: width < 800 });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  await p.goto(FILE + (scenario.qs || ''));
  const steps = [];
  const hscroll = async tag => { const o = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); if (o > 0) log(`  [${width}] HSCROLL ${o}px at ${tag}`); };
  await hscroll('intro');
  log(`[${width} ${scenario.name}] demo link: ${await p.locator('text=Preview with a sample patient').count()}`);
  await p.click('#nextBtn');
  const step = async () => { const t = await p.locator('#chName').innerText(); steps.push(t.replace(/\s+/g,' ')); await hscroll(t); };
  // teeth
  await step();
  for (const n of scenario.teeth || []) await p.click(`[data-t="${n}"]`);
  const lbl = await p.getAttribute('[data-t="3"]', 'aria-label'); log('  aria tooth3:', lbl);
  await cont(p);
  await step();
  log('  duration shown:', await p.locator('#f-duration').count());
  await opt(p, 'current:nothing'); await opt(p, 'impact:chew');
  await cont(p); await p.click('text=Keep going');
  await step(); await opt(p, 'smoke:never'); await cont(p);
  await step(); for (const k of scenario.health || ['none']) await opt(p, 'health:'+k); await cont(p);
  await step(); await opt(p,'gums:none'); await opt(p,'history:none'); await cont(p);
  await step(); log('  continue disabled before answers:', await p.isDisabled('#nextBtn'));
  await opt(p,'consult:no'); await opt(p,'imaging:none'); await opt(p,'anxiety:fear');
  log('  sedation note:', await p.locator('text=IV sedation').count() > 0);
  await cont(p); await p.click('text=Keep going');
  await step(); await opt(p,'from:'+(scenario.from||'az')); await opt(p,'travel:drive'); await cont(p);
  if (scenario.from !== 'mx'){ await step(); await opt(p,'docs:card'); await cont(p); }
  await step(); await opt(p,'second:yes'); await cont(p); await p.click('text=Keep going');
  await step(); await opt(p,'priority:fixed'); await cont(p);
  await step(); await opt(p,'timing:asap'); await opt(p,'pay:insurance');
  log('  insurance placeholder:', await p.locator('mark.pending').count());
  await cont(p); await p.click('text=See my solution');
  await p.waitForSelector('#nextstep', { timeout: 8000 });
  await p.waitForTimeout(400);
  await hscroll('result');
  log('  steps:', steps.length, '|', steps.join(' / '));
  const h2 = await p.locator('.res-hero h2').innerText(); log('  result:', h2);
  const order = await p.evaluate(() => [...document.querySelectorAll('.screen > *')].map(e => (e.className || e.tagName).toString().split(' ')[0] + (e.querySelector('h3') ? ':' + e.querySelector('h3').innerText.slice(0,28) : '')).join(' | '));
  log('  order:', order);
  log('  clinic view:', await p.locator('details.internal').count());
  // form
  await p.fill('#em', 'test@example.com'); await p.selectOption('#cc', 'MX'); await p.fill('#ph', '658 596 8115');
  log('  send disabled w/o consent:', await p.isDisabled('#sendBtn'));
  await p.check('#consent'); log('  send enabled:', !(await p.isDisabled('#sendBtn')));
  if (scenario.payload){ const pl = await p.evaluate(() => document.querySelector('details.internal pre')?.textContent); log('  PAYLOAD', pl); }
  await p.click('#sendBtn'); await p.waitForSelector('text=Your plan is on its way');
  log('  upload input accept:', await p.getAttribute('#xr', 'accept'));
  await p.setInputFiles('#xr', { name: 'pano.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('x') });
  await p.waitForTimeout(100);
  log('  wa href:', (await p.getAttribute('.contactrow a.cbtn', 'href')).slice(0, 60));
  const ev = await p.evaluate(() => window.dataLayer.map(e => e.event + (e.step_id ? ':' + e.step_id : e.chapter ? ':' + e.chapter : e.solucion_probable ? ':' + e.solucion_probable : e.intencion ? ':' + e.intencion : '')));
  log('  events:', ev.join(', '));
  log('  fonts<12:', await p.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.offsetParent && e.childNodes.length && [...e.childNodes].some(n => n.nodeType===3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < 12).map(e => e.className || e.tagName).slice(0,8).join(',') || 'none'));
  log('  small targets:', await p.evaluate(() => [...document.querySelectorAll('button, a, select, input:not([type=file])')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.height < 44 || r.width < 44) && !e.closest('.check') && !e.closest('svg'); }).map(e => (e.className||e.tagName)+':'+Math.round(e.getBoundingClientRect().height)).slice(0,10).join(', ') || 'none'));
  await p.screenshot({ path: `tests/result_${width}_${scenario.name}.png`, fullPage: false });
  log('  errors:', errs.length ? errs.join(' || ') : 'none');
  await b.close();
}
(async () => {
  await run(375, { name: 'base', teeth: [3, 4, 14, 30] });
  await run(1280, { name: 'mx-med', teeth: [], from: 'mx', health: ['pregnant'], qs: '?modo=clinica&demo=1&utm_source=fb&utm_campaign=x', payload: true });
  await run(768, { name: 'eval', teeth: [] });
  console.log(out.join('\n'));
})();
