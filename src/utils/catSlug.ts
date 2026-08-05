import slugify from 'slugify';

export function catSlug(name: string): string {
  return slugify(name, { lower: true, strict: true, locale: 'sk' });
}