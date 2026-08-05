const fs = require('fs');
const path = require('path');

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

  // Zachytí wordwall link v texte, v HTML tagu <a>, aj v odseku <p>
  const wordwallRegex = /(?:<p[^>]*>)?\s*(?:<a [^>]*>)?\s*(?:https?:\/\/)?(?:www\.)?wordwall\.net\/(?:play|resource|embed)\/([0-9]+)(?:\/[^\s"'<>]+)?\s*(?:<\/a>)?\s*(?:<\/p>)?/gi;

  if (wordwallRegex.test(content)) {
    const updatedContent = content.replace(wordwallRegex, (match, id) => {
      return `<iframe src="https://wordwall.net/embed/resource/${id}?aria=true" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;
    });

    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Opravený: ${file}`);
      updatedCount++;
    }
  }
});

console.log(`\n🎉 HOTOVO! Automaticky opravených súborov: ${updatedCount}`);