import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  const { slug } = req.query;
  if (!slug || typeof slug !== 'string') {
    res.status(400).json({ error: 'missing slug' });
    return;
  }
  try {
    const count = await redis.incr(`views:${slug}`);
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ views: count });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
