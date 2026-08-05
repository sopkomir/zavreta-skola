import fs from 'fs';
import path from 'path';

const dirPath = path.join(process.cwd(), 'src', 'content', 'namety');

if (!fs.existsSync(dirPath)) {
  console.error('❌ Zložka src/content/namety neexistuje!');
  process.exit(1);
}

const files = fs.readdirSync(dirPath);
let updatedCount = 0;

files.forEach((file) => {
  if (!file.endsWith('.md') && !file.endsWith('.mdx')) return;

  const filePath = path.join(dirPath, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Nájdeme pubDate (rok a mesiac)
  const dateMatch = content.match(/pubDate:\s*"?(\d{4})-(\d{2})-\d{2}"?/);
  // Nájdeme slug alebo názov súboru
  const slugMatch = content.match(/slug:\s*"([^"]+)"/);

  if (dateMatch && (slugMatch || file)) {
    const year = dateMatch[1];
    const month = dateMatch[2];
    const rawSlug = slugMatch ? slugMatch[1] : file.replace(/\.mdx?$/, '');
    
    // Vyčistíme slug pre prípadné skrátenie názvu obrázka
    const simpleSlug = rawSlug.replace(/^3d-/, '').replace(/-v-css$/, '');

    // Upravíme imageUrl na správny tvar s rokom a mesiacom
    const newImageUrl = `https://www.zavretaskola.sk/wp-content/uploads/${year}/${month}/${simpleSlug}.jpg`;

    const updatedContent = content.replace(
      /imageUrl:\s*"[^"]*"/,
      `imageUrl: "${newImageUrl}"`
    );

    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Opravený obrázok pre: ${file} -> ${newImageUrl}`);
      updatedCount++;
    }
  }
});

console.log(`\n🎉 Hotovo! Automaticky opravených náhľadov: ${updatedCount}`);