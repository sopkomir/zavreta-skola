// Vytiahne krátky čistý textový popis z markdown obsahu (na SEO/OG popis,
// keď ho autor v CMS ručne nevyplní).
export function excerpt(text: string, length = 155): string {
  const plain = text
    .replace(/<[^>]+>/g, ' ') // HTML tagy
    .replace(/!\[.*?\]\(.*?\)/g, ' ') // obrázky
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // odkazy -> nechá text
    .replace(/[#*_>`]/g, ' ') // markdown znaky
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= length) return plain;
  return plain.slice(0, length).replace(/\s+\S*$/, '') + '…';
}
