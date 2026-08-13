import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }
  const { slugs } = req.body || {};
  if (!Array.isArray(slugs) || slugs.length === 0) {
    res.status(400).json({ error: 'missing slugs array' });
    return;
  }
  try {
    const keys = slugs.map((s) => `views:${s}`);
    const values = await redis.mget(...keys);
    const result = {};
    slugs.forEach((slug, i) => {
      result[slug] = values[i] != null ? Number(values[i]) : 0;
    });
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ views: result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
