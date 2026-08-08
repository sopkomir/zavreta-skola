import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import crypto from 'crypto';

function contentHash(str) {
  return crypto.createHash('sha1').update(str).digest('hex');
}

// Zapíše súbor len ak: (a) ešte neexistuje, alebo (b) sa od posledného importu nezmenil ručne.
// Ak bol súbor ručne upravený v CMS (jeho aktuálny hash nesedí s hashom, ktorý sme si naposledy uložili),
// PRESKOČÍME ho a ponecháme ručnú úpravu nedotknutú.
function writeIfSafe(filePath, freshBodyContent) {
  const freshHash = contentHash(freshBodyContent);
  const withMarker = freshBodyContent + `\n<!-- wp-source-hash: ${freshHash} -->\n`;

  if (fs.existsSync(filePath)) {
    const existing = fs.readFileSync(filePath, 'utf8');
    const markerMatch = existing.match(/<!-- wp-source-hash: ([a-f0-9]+) -->/);
    const existingWithoutMarker = existing.replace(/\n<!-- wp-source-hash: [a-f0-9]+ -->\n?$/, '');
    const existingActualHash = contentHash(existingWithoutMarker);

    if (!markerMatch || markerMatch[1] !== existingActualHash) {
      return 'preskočené (ručne upravené)';
    }
  }

  fs.writeFileSync(filePath, withMarker, 'utf8');
  return fs.existsSync(filePath) ? 'ok' : 'ok';
}

// ---- Nastavenia ----
const XML_PATH = process.argv[2] || 'exports/wordpress.xml';
const NAMETY_DIR = 'src/content/namety';
const CLANKY_DIR = 'src/content/clanky';
const DATA_DIR = 'src/data';
const WP_BASE = 'https://www.zavretaskola.sk';

function catSlug(name) {
  return slugify(name, { lower: true, strict: true, locale: 'sk' });
}

// ---- Parsovanie XML ----
const xml = fs.readFileSync(XML_PATH, 'utf8');
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  isArray: (name) => ['item', 'category', 'wp:postmeta', 'wp:term', 'wp:category'].includes(name),
});
const doc = parser.parse(xml);
const items = doc.rss.channel.item || [];
const terms = doc.rss.channel['wp:term'] || [];

function text(v) {
  if (v == null) return '';
  if (typeof v === 'string' || typeof v === 'number') return String(v);
  if (typeof v === 'object' && '#text' in v) return String(v['#text']);
  return '';
}

// ---- 1. Mapa príloh (attachment) pre _thumbnail_id ----
const attachmentUrlByPostId = new Map();
for (const it of items) {
  if (text(it['wp:post_type']) === 'attachment') {
    attachmentUrlByPostId.set(text(it['wp:post_id']), text(it['wp:attachment_url']));
  }
}

// ---- 2. Hierarchia kategórií (ad_category) z wp:term ----
// { name -> { slug, parentSlug } }
const categoryTermsBySlug = new Map();
for (const t of terms) {
  if (text(t['wp:term_taxonomy']) !== 'ad_category') continue;
  categoryTermsBySlug.set(text(t['wp:term_slug']), {
    name: text(t['wp:term_name']),
    parentSlug: text(t['wp:term_parent']) || null,
  });
}
const topLevelNames = [...categoryTermsBySlug.values()].filter((c) => !c.parentSlug).map((c) => c.name);
// meno dieťaťa -> meno rodiča (top-level)
const childToTopLevel = new Map();
for (const c of categoryTermsBySlug.values()) {
  if (c.parentSlug && categoryTermsBySlug.has(c.parentSlug)) {
    const parent = categoryTermsBySlug.get(c.parentSlug);
    if (!parent.parentSlug) childToTopLevel.set(c.name, parent.name);
  }
}

// ---- 2b. Mapa prihlasovacie meno (login) -> skutočné zobrazované meno autora ----
const authors = doc.rss.channel['wp:author'] || [];
const loginToDisplayName = new Map();
for (const a of authors) {
  const login = text(a['wp:author_login']);
  const display = text(a['wp:author_display_name']);
  if (login && display) loginToDisplayName.set(login, display);
}
function resolveAuthor(loginRaw) {
  const login = loginRaw || '';
  return loginToDisplayName.get(login) || login || 'Zavretá škola';
}

// ---- 3. Pomocné extrakčné funkcie ----
function getPostMeta(item) {
  const raw = item['wp:postmeta'] || [];
  const map = {};
  for (const m of raw) {
    map[text(m['wp:meta_key'])] = text(m['wp:meta_value']);
  }
  return map;
}

function getCategoriesByDomain(item, domain) {
  const cats = item.category || [];
  const arr = Array.isArray(cats) ? cats : [cats];
  return arr
    .filter((c) => c && c['@_domain'] === domain)
    .map((c) => text(c))
    .filter(Boolean);
}

function extractFirstUrlFromSerialized(serialized) {
  if (!serialized) return null;
  const match = serialized.match(/https?:\/\/[^\s";]+?\.(?:jpg|jpeg|png|gif|webp)/i);
  return match ? match[0] : null;
}

function extractYouTubeId(content) {
  if (!content) return null;
  const match = content.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  return match ? match[1] : null;
}

function extractWordwallEmbed(content) {
  if (!content) return null;
  const match = content.match(/https?:\/\/(?:www\.)?wordwall\.net\/[^\s")\]]+/i);
  if (!match) return null;
  let url = match[0].replace(/&#0?38;/g, '&');
  if (!url.includes('/embed/')) {
    const idMatch = url.match(/wordwall\.net\/(?:[a-z]{2}\/)?resource\/([a-zA-Z0-9]+)/i);
    if (idMatch) url = `https://wordwall.net/embed/${idMatch[1]}`;
  }
  return url;
}

function cleanContent(raw) {
  if (!raw) return '';
  return raw
    .replace(/\[embed\][\s\S]*?\[\/embed\]/gi, '') // WP embed shortcode -> ide do frontmatteru
    .replace(/<!--\s*\/?wp:[\s\S]*?-->/gi, '') // Gutenberg blokové komentáre
    .replace(/<figure[^>]*wp-block-embed[\s\S]*?<\/figure>/gi, '') // obalený embed blok -> nahradí ho iframe z frontmatteru
    .replace(/\[.*?\]/g, '') // ostatné WP shortcody
    .trim();
}

function yamlString(s) {
  return JSON.stringify(String(s ?? ''));
}
function yamlArray(arr) {
  return `[${arr.map((s) => JSON.stringify(s)).join(', ')}]`;
}

function uniqueSlug(base, usedSlugs) {
  let slug = catSlug(base) || 'polozka';
  let finalSlug = slug;
  let n = 2;
  while (usedSlugs.has(finalSlug)) finalSlug = `${slug}-${n++}`;
  usedSlugs.add(finalSlug);
  return finalSlug;
}

function resolveImage(item, meta, rawContent) {
  let image =
    extractFirstUrlFromSerialized(meta['_tc_gallery']) ||
    (meta['_thumbnail_id'] && attachmentUrlByPostId.get(meta['_thumbnail_id'])) ||
    (rawContent.match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] ||
    null;
  if (image && image.startsWith('/')) image = WP_BASE + image;
  return image;
}

// ================= NÁMETY (classified) =================
fs.mkdirSync(NAMETY_DIR, { recursive: true });

let nametyImported = 0;
let nametySkipped = 0;
const skippedFiles = [];
const nametySlugs = new Set();
const leafCategoryCounts = new Map(); // meno kategórie (leaf, ako je v .md) -> počet

for (const item of items) {
  if (text(item['wp:post_type']) !== 'classified' || text(item['wp:status']) !== 'publish') continue;

  const title = text(item.title) || 'Bez názvu';
  const rawContent = text(item['content:encoded']);
  const content = cleanContent(rawContent);
  const pubDate = (text(item['wp:post_date']) || '').split(' ')[0] || new Date().toISOString().split('T')[0];
  const author = resolveAuthor(text(item['dc:creator']));
  const categories = getCategoriesByDomain(item, 'ad_category');
  const types = getCategoriesByDomain(item, 'ad_type');
  const meta = getPostMeta(item);
  const image = resolveImage(item, meta, rawContent);
  const youtubeId = extractYouTubeId(rawContent);
  const wordwallEmbed = extractWordwallEmbed(rawContent);
  const viewsRaw = meta['_pe_base_popular_posts_count'] || meta['_terraclassifieds_popular_posts_count'];
  const views = viewsRaw ? parseInt(viewsRaw, 10) : null;

  for (const c of categories) leafCategoryCounts.set(c, (leafCategoryCounts.get(c) || 0) + 1);

  const slug = uniqueSlug(text(item['wp:post_name']) || title, nametySlugs);

  const lines = [
    '---',
    `title: ${yamlString(title)}`,
    `pubDate: ${pubDate}`,
    `author: ${yamlString(author)}`,
    `categories: ${yamlArray(categories)}`,
    `types: ${yamlArray(types)}`,
  ];
  if (image) lines.push(`image: ${yamlString(image)}`);
  if (youtubeId) lines.push(`youtubeId: ${yamlString(youtubeId)}`);
  if (wordwallEmbed) lines.push(`wordwallEmbed: ${yamlString(wordwallEmbed)}`);
  if (views !== null && !isNaN(views)) lines.push(`views: ${views}`);
  lines.push('---', '');

  const result = writeIfSafe(path.join(NAMETY_DIR, `${slug}.md`), lines.join('\n') + content);
  if (result === 'preskočené (ručne upravené)') {
    nametySkipped++;
    skippedFiles.push(slug);
  } else {
    nametyImported++;
  }
}

// ---- Hierarchický súbor kategórií (pre /kategoria stránky) ----
fs.mkdirSync(DATA_DIR, { recursive: true });

const topLevelTree = topLevelNames.map((topName) => {
  const directCount = leafCategoryCounts.get(topName) || 0;
  const children = [...childToTopLevel.entries()]
    .filter(([, top]) => top === topName)
    .map(([childName]) => ({
      name: childName,
      slug: catSlug(childName),
      count: leafCategoryCounts.get(childName) || 0,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);
  const childCount = children.reduce((sum, c) => sum + c.count, 0);
  return {
    name: topName,
    slug: catSlug(topName),
    count: directCount + childCount,
    children,
  };
}).filter((c) => c.count > 0);

fs.writeFileSync(path.join(DATA_DIR, 'categories.json'), JSON.stringify(topLevelTree, null, 2), 'utf8');

// ================= ČLÁNKY (post) =================
fs.mkdirSync(CLANKY_DIR, { recursive: true });

let clankyImported = 0;
let clankySkipped = 0;
const clankySlugs = new Set();

for (const item of items) {
  if (text(item['wp:post_type']) !== 'post' || text(item['wp:status']) !== 'publish') continue;

  const title = text(item.title) || 'Bez názvu';
  const rawContent = text(item['content:encoded']);
  const content = cleanContent(rawContent);
  const pubDate = (text(item['wp:post_date']) || '').split(' ')[0] || new Date().toISOString().split('T')[0];
  const author = resolveAuthor(text(item['dc:creator']));
  const rubrika = getCategoriesByDomain(item, 'category');
  const meta = getPostMeta(item);
  const image = resolveImage(item, meta, rawContent);
  const youtubeId = extractYouTubeId(rawContent);

  const slug = uniqueSlug(text(item['wp:post_name']) || title, clankySlugs);

  const lines = [
    '---',
    `title: ${yamlString(title)}`,
    `pubDate: ${pubDate}`,
    `author: ${yamlString(author)}`,
    `rubrika: ${yamlArray(rubrika)}`,
  ];
  if (image) lines.push(`image: ${yamlString(image)}`);
  if (youtubeId) lines.push(`youtubeId: ${yamlString(youtubeId)}`);
  lines.push('---', '');

  const result = writeIfSafe(path.join(CLANKY_DIR, `${slug}.md`), lines.join('\n') + content);
  if (result === 'preskočené (ručne upravené)') {
    clankySkipped++;
  } else {
    clankyImported++;
  }
}

console.log(`\n✅ Hotovo!`);
console.log(`   Námety: ${nametyImported} aktualizovaných/nových, ${nametySkipped} preskočených (ručne upravené) do ${NAMETY_DIR}/`);
if (skippedFiles.length > 0) {
  console.log(`   Ručne upravené (nedotknuté): ${skippedFiles.join(', ')}`);
}
console.log(`   Kategórie: ${topLevelTree.length} hlavných, ${topLevelTree.reduce((s, c) => s + c.children.length, 0)} podkategórií -> ${DATA_DIR}/categories.json`);
console.log(`   Články: ${clankyImported} aktualizovaných/nových, ${clankySkipped} preskočených (ručne upravené) do ${CLANKY_DIR}/`);
