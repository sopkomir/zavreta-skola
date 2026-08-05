import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import path from 'path';
import slugify from 'slugify';

const OLD_WP_BASE = 'https://www.zavretaskola.sk';

function cleanHtml(content) {
  return content
    .replace(/\[.*?\]/g, '')           // shortcodes
    .replace(/<!--.*?-->/gs, '')
    .trim();
}

async function main() {
  console.log('Načítavam WordPress XML...');
  
  const xmlData = fs.readFileSync(path.join('exports', 'wordpress.xml'), 'utf8');
  const parser = new XMLParser({ 
    ignoreAttributes: false,
    isArray: (tag) => ['item', 'category'].includes(tag)
  });
  
  const result = parser.parse(xmlData);
  const items = result.rss.channel.item || [];
  
  let count = 0;
  const targetDir = path.join('src', 'content', 'namety');
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const item of items) {
    if (item['wp:post_type']?.[0] !== 'post') continue;
    
    const title = item.title?.[0] || 'Bez názvu';
    const rawContent = item['content:encoded']?.[0] || '';
    const content = cleanHtml(rawContent);
    const pubDate = item['wp:post_date']?.[0]?.split(' ')[0] || new Date().toISOString().split('T')[0];
    const author = item['dc:creator']?.[0] || 'Zavretá škola';
    const slug = slugify(title, { lower: true, strict: true, locale: 'sk' }) || `post-${count}`;

    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
pubDate: ${pubDate}
author: "${author}"
subject: "ostatne"
grade: 1
topics: []
---

${content}
`;

    const filePath = path.join(targetDir, `${slug}.md`);
    fs.writeFileSync(filePath, frontmatter);
    
    count++;
    if (count % 10 === 0) console.log(`Importovaných ${count}...`);
  }

  console.log(`\n✅ Hotovo! Importovaných ${count} príspevkov do src/content/namety/`);
}

main().catch(err => console.error('Chyba:', err));