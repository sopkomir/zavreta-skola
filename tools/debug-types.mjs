import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import path from 'path';

const xmlData = fs.readFileSync(path.join('exports', 'wordpress.xml'), 'utf8');
const parser = new XMLParser({ ignoreAttributes: false });
const result = parser.parse(xmlData);
const items = result.rss.channel.item || [];

const types = {};

for (const item of items) {
  const type = item['wp:post_type'] || 'unknown';
  const status = item['wp:status'] || 'unknown';
  const key = `${type} | ${status}`;
  types[key] = (types[key] || 0) + 1;
}

console.log('Typy obsahu v XML:\n');
Object.entries(types)
  .sort((a, b) => b[1] - a[1])
  .forEach(([key, count]) => console.log(`${count.toString().padStart(5)} × ${key}`));