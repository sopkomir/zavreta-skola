// Prepíše všetky odkazy na obrázky zo "zavretaskola.sk/wp-content/..."
// na novú subdoménu (napr. "media.zavretaskola.sk/wp-content/..."),
// ktorá naďalej ukazuje na ten istý bežiaci WordPress hosting.
// Žiadne sťahovanie, žiadny prenos dát - len úprava textu v súboroch.
//
// Spustenie: node tools/relink-images.mjs media.zavretaskola.sk

import fs from 'fs';
import path from 'path';

const NEW_HOST = process.argv[2];
if (!NEW_HOST) {
  console.error('Chýba nová doména. Použitie: node tools/relink-images.mjs media.zavretaskola.sk');
  process.exit(1);
}

const OLD_HOST_PATTERN = /https?:\/\/(?:www\.)?zavretaskola\.sk(\/wp-content\/)/gi;
const CONTENT_DIRS = ['src/content/namety', 'src/content/clanky'];
const EXTRA_FILES = ['src/layouts/Layout.astro'];

let filesChanged = 0;
let linksChanged = 0;

function processFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const matches = text.match(OLD_HOST_PATTERN);
  if (!matches) return;

  const updated = text.replace(OLD_HOST_PATTERN, `https://${NEW_HOST}$1`);
  fs.writeFileSync(filePath, updated, 'utf8');
  filesChanged++;
  linksChanged += matches.length;
  console.log(`✅ ${filePath}: ${matches.length} odkazov prepísaných`);
}

for (const dir of CONTENT_DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    processFile(path.join(dir, f));
  }
}

for (const filePath of EXTRA_FILES) {
  if (fs.existsSync(filePath)) processFile(filePath);
}

console.log(`\n✅ Hotovo! ${filesChanged} súborov, ${linksChanged} odkazov prepísaných na ${NEW_HOST}`);
