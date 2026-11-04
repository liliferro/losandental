const { chromium } = require('playwright');
async function reach(p){
 await p.goto('file://' + process.cwd() + '/dist/_preview.html?demo=1'); await p.click('text=Preview with a sample patient'); await p.waitForSelector('.proof', { timeout: 8000 });
 await p.locator('.proof .cmp').scrollIntoViewIfNeeded(); await p.waitForTimeout(3600);
}
const X = p => p.evaluate(() => parseFloat(document.querySelector('.proof .cmp').style.getPropertyValue('--x')));
(async () => { const b = await chromium.launch();
 // mouse: press on the knob and drag right, then click near the left edge
 let p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage(); await reach(p);
 let r = await p.locator('.proof .cmp').boundingBox();
 await p.mouse.move(r.x + r.width/2, r.y + r.height/2); await p.mouse.down(); await p.mouse.move(r.x + r.width*0.85, r.y + r.height/2, { steps: 8 }); await p.mouse.up();
 const a = await X(p);
 await p.mouse.click(r.x + r.width*0.1, r.y + r.height*0.8); const c = await X(p);
 // keyboard
 await p.focus('.proof .cmp-range'); await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowRight'); const k = await X(p);
 console.log('mouse drag→', a.toFixed(0), '| click left→', c.toFixed(0), '| keyboard→', k.toFixed(0));
 // touch: horizontal swipe via CDP touch events
 const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }); p = await ctx.newPage(); await reach(p);
 r = await p.locator('.proof .cmp').boundingBox(); const cdp = await ctx.newCDPSession(p);
 const y = r.y + r.height/2, pt = x => [{ x, y }];
 await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt(r.x + r.width*0.5) });
 for (let i = 1; i <= 8; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pt(r.x + r.width*(0.5 - i*0.05)) });
 await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
 console.log('touch swipe left→', (await X(p)).toFixed(0));
 
 await b.close(); })();
// vertical swipe over the image must not move the slider
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }); const p = await ctx.newPage(); await reach(p);
 const r = await p.locator('.proof .cmp').boundingBox(); const cdp = await ctx.newCDPSession(p); const x = r.x + r.width*0.2;
 await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: r.y + r.height*0.8 }] });
 for (let i = 1; i <= 6; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: r.y + r.height*0.8 - i*15 }] });
 await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
 console.log('vertical swipe → x stays:', (await X(p)).toFixed(0)); await b.close(); })();
