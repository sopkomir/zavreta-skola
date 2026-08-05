import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'namety');

// Pomocná funkcia na odstránenie diakritiky (mäkčne, dĺžne)
function normalizeString(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

async function matchOnlyImages() {
  console.log('🔍 Sťahujem mediálnu knižnicu WordPressu...');

  let page = 1;
  let allMedia = [];

  while (true) {
    try {
      const res = await fetch(`https://www.zavretaskola.sk/wp-json/wp/v2/media?per_page=100&page=${page}`);
      if (!res.ok) break;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;
      allMedia = allMedia.concat(data);
      page++;
    } catch {
      break;
    }
  }

  // 1. FILTRUJEME IBA SKUTOČNÉ OBRÁZKY (nepustíme .pdf, .zip, .pptx, atď.)
  const imageMedia = allMedia.filter((m) => {
    if (!m.source_url) return false;
    const ext = m.source_url.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext);
  });

  console.log(`🖼️ Načítaných ${imageMedia.length} REÁLNYCH OBRÁZKOV (ignorované súbory ako PDF/ZIP/PPTX).`);

  // Mapy pre vyhľadávanie
  const slugToUrl = new Map();
  const filenameToUrl = new Map();

  imageMedia.forEach((m) => {
    const url = m.source_url;

    // A) Podľa slugu v WP (s normalizovanou diakritikou)
    if (m.slug) {
      const normSlug = normalizeString(m.slug);
      slugToUrl.set(normSlug, url);
      // Očistenie od rozmerov obrázka (napr. -150x150)
      slugToUrl.set(normSlug.replace(/-\d+x\d+$/, ''), url);
    }

    // B) Podľa názvu súboru (s normalizovanou diakritikou)
    const fname = url.split('/').pop().split('?')[0].replace(/\.[^/.]+$/, "");
    const normFname = normalizeString(fname);
    filenameToUrl.set(normFname, url);
  });

  const files = fs.readdirSync(CONTENT_DIR);
  let updatedCount = 0;

  files.forEach((file) => {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) return;

    const filePath = path.join(CONTENT_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Slug z .md súboru alebo z názvu súboru
    const slugMatch = content.match(/slug:\s*"([^"]+)"/);
    const rawSlug = slugMatch ? slugMatch[1] : file.replace(/\.mdx?$/, '');
    const normFileSlug = normalizeString(rawSlug);

    // Doterajšia URL v súbore
    const imgMatch = content.match(/imageUrl:\s*"([^"]+)"/);
    const currentUrl = imgMatch ? imgMatch[1] : '';
    
    const currentFname = currentUrl ? currentUrl.split('/').pop().split('?')[0].replace(/\.[^/.]+$/, "") : '';
    const normCurrentFname = normalizeString(currentFname);

    // Hľadáme najlepšiu zhodu medzi reálnymi obrázkami:
    const bestMatchUrl = slugToUrl.get(normFileSlug) || filenameToUrl.get(normCurrentFname) || filenameToUrl.get(normFileSlug);

    if (bestMatchUrl && currentUrl !== bestMatchUrl) {
      if (imgMatch) {
        content = content.replace(/imageUrl:\s*"[^"]*"/, `imageUrl: "${bestMatchUrl}"`);
      } else {
        content = content.replace(/---/, `---\nimageUrl: "${bestMatchUrl}"`);
      }

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ [${rawSlug}] -> ${bestMatchUrl}`);
      updatedCount++;
    }
  });

  console.log(`\n🎉 HOTOVO! Úspešne vyčistených a aktualizovaných ${updatedCount} Markdown súborov!`);
}

matchOnlyImages();