// Skript skúsi automaticky opraviť staré Wordwall embed odkazy (číselný formát)
// na nový formát (hash), stiahnutím verejnej stránky /resource/{staréČíslo}
// a vytiahnutím hashu z jej og:image meta tagu.
//
// Spustenie: node tools/fix-wordwall.mjs

import fs from 'fs';
import path from 'path';

const DIR = 'src/content/namety';
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.md'));

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let fixed = 0;
let failed = 0;
let skipped = 0;
const failedList = [];

for (const f of files) {
  const filePath = path.join(DIR, f);
  const text = fs.readFileSync(filePath, 'utf8');
  const match = text.match(/wordwallEmbed: "https:\/\/wordwall\.net\/embed\/(\d+)"/);

  if (!match) {
    skipped++;
    continue; // nemá wordwall pole, alebo je už v novom (hash) formáte
  }

  const oldId = match[1];

  try {
    const res = await fetch(`https://wordwall.net/resource/${oldId}`, { redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    const hashMatch = html.match(/screens\.cdn\.wordwall\.net\/\d+\/([a-f0-9]{32})_/);

    if (hashMatch) {
      const hash = hashMatch[1];
      const newUrl = `https://wordwall.net/embed/${hash}`;
      const updated = text.replace(
        /wordwallEmbed: "https:\/\/wordwall\.net\/embed\/\d+"/,
        `wordwallEmbed: "${newUrl}"`
      );
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`✅ ${f}: ${oldId} -> ${hash}`);
      fixed++;
    } else {
      console.log(`⚠️  ${f}: hash sa nenašiel na stránke (skontrolujte ručne, staré ID ${oldId})`);
      failed++;
      failedList.push(f);
    }
  } catch (e) {
    console.log(`❌ ${f}: chyba - ${e.message} (staré ID ${oldId})`);
    failed++;
    failedList.push(f);
  }

  await sleep(500); // slušnosť voči wordwall.net serveru - nebombardovať naraz
}

console.log(`\n✅ Hotovo!`);
console.log(`   Opravených automaticky: ${fixed}`);
console.log(`   Zlyhalo (treba ručne): ${failed}`);
if (failedList.length > 0) {
  console.log(`   Zoznam na ručnú opravu: ${failedList.join(', ')}`);
}
