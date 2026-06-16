// Health check endpoint — needed to satisfy Vercel's Node.js project config
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({ status: 'ok', timestamp: Date.now() });
}
