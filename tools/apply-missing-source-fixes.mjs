// Druhá dávka: aplikuje dohľadané odkazy pre námety, ktorým úplne chýbal zdroj.
// Rozlišuje medzi Wordwall hrami, YouTube videami a obyčajnými odkazmi (pridané do textu).
//
// Spustenie: node tools/apply-missing-source-fixes.mjs

import fs from 'fs';
import path from 'path';

const DIR = 'src/content/namety';

const WORDWALL_FIXES = {
  'vybrane-slova-po-b-m-p':
    'https://wordwall.net/embed/bde6bbaaf6114244b2d0747e123e5e75?themeId=1&templateId=5&fontStackId=0',
  'tvrde-a-makke-spoluhlasky':
    'https://wordwall.net/sk/embed/ac0795dd942443dbeada5d31d5a0fa0?themeId=21&templateId=69&fontStackId=0',
  'hra-usporiadaj-slova-do-viet':
    'https://wordwall.net/sk/embed/a27e97626fda44f0b68da6bf9f6c6ee3?themeId=45&templateId=72&fontStackId=0',
  'osemsmerovka-vybrane-slova-po-s':
    'https://wordwall.net/embed/17b3a4f8fd95411d984e2adcef47b3f0?themeId=2&templateId=10&fontStackId=0',
  'osemsmerovka-vybrane-a-pribuzne-slovo-syty':
    'https://wordwall.net/embed/b73b6aacc56f4b9993325c8c0781034a?themeId=3&templateId=10&fontStackId=0',
  'slovensko-na-mape-slepa-mapa-pohoria-priehrady-niziny-hlavne-mesto':
    'https://wordwall.net/sk/embed/6c30f6a6cef7446cb2345b3b3f0d5100?themeId=1&templateId=22&fontStackId=0',
  'sjl1-pripravne-obdobie-velke-tlacene-slabiky':
    'https://wordwall.net/sk/embed/7df4930e039a4202a725dc4a1f7f2a8d?themeId=1&templateId=5&fontStackId=0',
  'orientacia-podla-svetovych-stran':
    'https://wordwall.net/sk/embed/d9aef668ea5547df856fdc34e876f388?themeId=1&templateId=11&fontStackId=0',
  'pexeso-cisla-od-10-do-10':
    'https://wordwall.net/sk/embed/4cc7cb16dccd442b888b5bc51d1f4ae3?themeId=4&templateId=25&fontStackId=0',
  'zamena-oni-ony':
    'https://wordwall.net/embed/97d37b7799c64548a7c4b46bdaa68960?themeId=65&templateId=36&fontStackId=0',
  'sjl1-pismenkove-rodinky':
    'https://wordwall.net/sk/embed/77922096c0d0480b85d38684cba85472?themeId=46&templateId=2&fontStackId=0',
  'sjl1-nacvicne-obdobie-s-o-j-z':
    'https://wordwall.net/sk/embed/a730f355ba5a4012a13c6c0ff98303be?themeId=1&templateId=5&fontStackId=0',
  'vla4-od-tatier-k-dunaju-tatry':
    'https://wordwall.net/sk/embed/fc8c9d28427f4b4ea179d4a66db9d1d4?themeId=1&templateId=5&fontStackId=0',
  'vla4-od-tatier-k-dunaju-poprad':
    'https://wordwall.net/sk/embed/32d69fa00c1741d8ab43cb9d5f7c0a6a?themeId=1&templateId=5&fontStackId=0',
  'vla4-od-tatier-k-dunaju-nizke-tatry':
    'https://wordwall.net/sk/embed/53feee86a8ef49c4bd297e220792e6ea?themeId=1&templateId=5&fontStackId=0',
  'vla4-od-tatier-k-dunaju-turiec':
    'https://wordwall.net/sk/embed/8cc77970ca5b4d88810e19a19aa295b4?themeId=1&templateId=5&fontStackId=0',
  'vla4-od-tatier-po-dunaj-velka-a-mala-fatra':
    'https://wordwall.net/sk/embed/758ad4104a674f5faf281c776e8a6e34?themeId=1&templateId=5&fontStackId=0',
  'vla4-od-tatier-k-dunaju-orava':
    'https://wordwall.net/sk/embed/0efaed9f3d554ebe9af72aa63354ee45?themeId=1&templateId=5&fontStackId=0',
  'vla4-od-tatier-k-dunaju-kysuce':
    'https://wordwall.net/sk/embed/0a7e46d38a6a4ec9aafb33700645a187?themeId=1&templateId=5&fontStackId=0',
};

const YOUTUBE_FIXES = {
  bag: 'kbA1YDXBtnM', // Umývanie ručičiek podľa pesničky
};

const LINK_FIXES = {
  'h-edu': { url: 'https://www.h-edu.sk', label: 'H-EDU (vzdelávací portál)' },
  'spoluhlasky-mnemotechnicka-pomocka': {
    url: 'https://www.hlbavo.sk/zapisky-z-hlbin/mnemotechnicke-pomocky-na-hodinach-slovenciny-11',
    label: 'Mnemotechnické pomôcky na hodinách slovenčiny',
  },
  'evolucia-abecedy': {
    url: 'https://sk.wikipedia.org/wiki/História_abecedy',
    label: 'História abecedy (Wikipédia)',
  },
};

function applyWordwall() {
  let n = 0;
  for (const [slug, url] of Object.entries(WORDWALL_FIXES)) {
    const filePath = path.join(DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      console.log(`❌ ${slug}.md: súbor neexistuje`);
      continue;
    }
    let text = fs.readFileSync(filePath, 'utf8');
    if (/^wordwallEmbed: ".*"$/m.test(text)) {
      text = text.replace(/^wordwallEmbed: ".*"$/m, `wordwallEmbed: "${url}"`);
    } else {
      text = text.replace(/\n---\n/, `\nwordwallEmbed: "${url}"\n---\n`);
    }
    fs.writeFileSync(filePath, text, 'utf8');
    console.log(`✅ ${slug}.md: wordwallEmbed nastavené`);
    n++;
  }
  return n;
}

function applyYoutube() {
  let n = 0;
  for (const [slug, id] of Object.entries(YOUTUBE_FIXES)) {
    const filePath = path.join(DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      console.log(`❌ ${slug}.md: súbor neexistuje`);
      continue;
    }
    let text = fs.readFileSync(filePath, 'utf8');
    if (/^youtubeId: ".*"$/m.test(text)) {
      text = text.replace(/^youtubeId: ".*"$/m, `youtubeId: "${id}"`);
    } else {
      text = text.replace(/\n---\n/, `\nyoutubeId: "${id}"\n---\n`);
    }
    fs.writeFileSync(filePath, text, 'utf8');
    console.log(`✅ ${slug}.md: youtubeId nastavené`);
    n++;
  }
  return n;
}

function applyLinks() {
  let n = 0;
  for (const [slug, { url, label }] of Object.entries(LINK_FIXES)) {
    const filePath = path.join(DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      console.log(`❌ ${slug}.md: súbor neexistuje`);
      continue;
    }
    let text = fs.readFileSync(filePath, 'utf8');
    if (text.includes(url)) {
      console.log(`↷ ${slug}.md: odkaz už tam je, preskakujem`);
      continue;
    }
    text = text.replace(
      /\n?(<!-- wp-source-hash: [a-f0-9]+ -->\n?)?$/,
      `\n\nZdroj: [${label}](${url})\n$1`
    );
    fs.writeFileSync(filePath, text, 'utf8');
    console.log(`✅ ${slug}.md: pridaný odkaz do textu`);
    n++;
  }
  return n;
}

const w = applyWordwall();
const y = applyYoutube();
const l = applyLinks();

console.log(`\n✅ Hotovo! Wordwall: ${w}, YouTube: ${y}, odkazy v texte: ${l}`);
console.log(`\nNeriešené (nechajte tak, alebo dohľadajte ručne):`);
console.log(`  - Balkónovka, Pomôcky k učeniu vzorov (NENÁJDENÉ)`);
console.log(`  - Myšlienkové mapy, Mandala (agent našiel len neisté/všeobecné zhody, radšej ručne overiť)`);
