import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import path from 'path';

const xmlData = fs.readFileSync(path.join('exports', 'wordpress.xml'), 'utf8');
const parser = new XMLParser({ 
  ignoreAttributes: false,
  isArray: (tag) => ['item', 'category'].includes(tag)
});

const result = parser.parse(xmlData);
const items = result.rss.channel.item || [];

console.log('Počet items:', items.length);

if (items.length > 0) {
  const first = items[0];
  console.log('\n--- Prvý item ---');
  console.log('Kľúče:', Object.keys(first));
  console.log('post_type:', first['wp:post_type']);
  console.log('title:', first.title);
  console.log('status:', first['wp:status']);
}