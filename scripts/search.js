#!/usr/bin/env node
// Search a public OverDrive/Libby library catalog headlessly and print each result
// with its availability and links to open it in Libby or the library's catalog.
//
// Usage: node search.js "<query>" [library-key]
// Library key: argument, else $LIBBY_LIBRARY, else the first line of
// ~/.config/libby-search/library. Find yours at libbyapp.com/library/<key>.
//
// No login, no cookies, no personal profile: a fresh headless browser each run.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');

function libraryKey(arg) {
  if (arg) return arg;
  if (process.env.LIBBY_LIBRARY) return process.env.LIBBY_LIBRARY;
  try {
    return fs.readFileSync(path.join(os.homedir(), '.config/libby-search/library'), 'utf8').trim().split('\n')[0];
  } catch { return null; }
}

const query = process.argv[2];
const key = libraryKey(process.argv[3]);
if (!query) { console.error('usage: search.js "<query>" [library-key]'); process.exit(2); }
if (!key || !/^[a-z0-9-]+$/i.test(key)) {
  console.error('No valid library key. Pass one, set LIBBY_LIBRARY, or write it to ~/.config/libby-search/library.');
  process.exit(2);
}

(async () => {
  const url = `https://${key}.overdrive.com/search?query=${encodeURIComponent(query)}`;
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    // Results render client-side; the page also exposes them as window.OverDrive.mediaItems.
    const items = await page.evaluate(() => {
      const m = (window.OverDrive && window.OverDrive.mediaItems) || {};
      return Object.values(m).map(i => ({
        id: i.id,
        title: i.title + (i.subtitle ? `: ${i.subtitle}` : ''),
        creators: (i.creators || []).map(c => `${c.name} (${c.role})`).join('; '),
        type: i.type && i.type.name,
        available: i.isAvailable,
        owned: i.ownedCopies, availableCopies: i.availableCopies,
        holds: i.holdsCount, waitDays: i.estimatedWaitDays,
      }));
    });
    const count = await page.locator('text=/Showing .* results/').first().textContent().catch(() => null);
    console.log(`${url}\n${count ? count.trim() : 'result count not found on page'}`);
    if (!items.length) {
      console.log('NO ITEM DATA EXTRACTED — page structure may have changed; not the same as "no results".');
      process.exitCode = 1;
    }
    for (const i of items) {
      i.libby = `https://share.libbyapp.com/title/${i.id}`;
      i.catalog = `https://${key}.overdrive.com/media/${i.id}`;
      console.log(JSON.stringify(i));
    }
  } finally { await browser.close(); }
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
