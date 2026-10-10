import { diagnose } from '../server/diagnose.js';

// Vercel serverless function: POST /api/diagnose
// Reads GEMINI_API_KEY from the project's environment variables (Vercel → Settings → Environment Variables).
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body;
  try {
    body = req.body; // Vercel parses JSON bodies; it throws on malformed JSON
  } catch {
    body = null;
  }

  const { status, body: result } = await diagnose(body, process.env.GEMINI_API_KEY);
  return res.status(status).json(result);
}
