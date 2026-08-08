// Jednorazový skript: vloží ručne dohľadané Wordwall embed odkazy priamo
// do príslušných .md súborov namiesto kopírovania cez CMS.
//
// Spustenie: node tools/apply-wordwall-fixes.mjs

import fs from 'fs';
import path from 'path';

const DIR = 'src/content/namety';

const FIXES = {
  'delenie-c-9-karticky.md':
    'https://wordwall.net/embed/a9a3635e6e7f4d88ad41af099fafbe7b?themeId=23&templateId=35&fontStackId=0',
  'delenie-spoluhlasok.md':
    'https://wordwall.net/sk/embed/245da4247cff484dadbc0a5d708ef150?themeId=23&templateId=2&fontStackId=0',
  'doplnanie-pismen-makke-slabiky.md':
    'https://wordwall.net/embed/6402e46a25ce45a29931c7d7e02f6ae7?themeId=2&templateId=2&fontStackId=0',
  'nasobilka-2-3-4.md':
    'https://wordwall.net/embed/b434145c457047238630f88b28de42ac?themeId=65&templateId=30&fontStackId=0',
  'nasobilka-5-6-7-8-9-precvicovanie-si-nasobkov.md':
    'https://wordwall.net/embed/0ce54211c37b4fb5aa6226349a0b71bb?themeId=22&templateId=45&fontStackId=0',
  'nasobky-3-a-4-6-a-7-s-kartickami.md':
    'https://wordwall.net/embed/cb6e4f2c07764f4f95f5e61cd3d496e2?themeId=1&templateId=2&fontStackId=0',
  'pisanie-i-i-y-y-po-l-s-obrazkom.md':
    'https://wordwall.net/embed/cef784db937e4a1882bcb53f6beb4282?themeId=43&templateId=5&fontStackId=0',
  'vety-s-vybranymi-slovami-a-slovami-so-slabikotvornym-r-l-na-zopakovanie.md':
    'https://wordwall.net/embed/eecdf006a02f4f6da7f915a9bde837eb?themeId=41&templateId=5&fontStackId=0',
  'vyvodenie-pismeno-b.md':
    'https://wordwall.net/embed/3bccf3828b064f0f8104c5735c5aa32f?themeId=22&templateId=45&fontStackId=0',
};

let updated = 0;
let missing = 0;

for (const [filename, newUrl] of Object.entries(FIXES)) {
  const filePath = path.join(DIR, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${filename}: súbor neexistuje, preskakujem`);
    missing++;
    continue;
  }

  let text = fs.readFileSync(filePath, 'utf8');
  const escapedUrl = newUrl.replace(/&/g, '\\u0026'); // istota pri YAML

  if (/^wordwallEmbed: ".*"$/m.test(text)) {
    // pole existuje -> nahradiť
    text = text.replace(/^wordwallEmbed: ".*"$/m, `wordwallEmbed: "${newUrl}"`);
  } else {
    // pole chýba -> pridať pred uzatváracie "---"
    text = text.replace(/\n---\n/, `\nwordwallEmbed: "${newUrl}"\n---\n`);
  }

  fs.writeFileSync(filePath, text, 'utf8');
  console.log(`✅ ${filename}: aktualizované`);
  updated++;
}

console.log(`\n✅ Hotovo! Aktualizovaných: ${updated}, chýbajúcich súborov: ${missing}`);
