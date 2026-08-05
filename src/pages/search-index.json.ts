import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const allNamety = await getCollection('namety');
  const data = allNamety.map((n) => ({
    id: n.id,
    title: n.data.title,
    categories: n.data.categories,
    types: n.data.types,
    image: n.data.image,
  }));

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
};