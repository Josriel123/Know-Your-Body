import { defineConfig, loadEnv } from 'vite';
import { diagnose } from './server/diagnose.js';

// Locally there's no Vercel runtime, so `npm run dev` / `npm run preview` serve
// /api/diagnose from the same module the Vercel function uses. GEMINI_API_KEY comes
// from .env.local; without a VITE_ prefix, Vite never exposes it to browser code.
function localApi(env) {
  const handle = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.setHeader('Allow', 'POST');
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }

    let raw = '';
    for await (const chunk of req) raw += chunk;
    let body = null;
    try {
      body = JSON.parse(raw);
    } catch {
      // diagnose() rejects a null body with a 400
    }

    const { status, body: result } = await diagnose(body, env.GEMINI_API_KEY);
    res.statusCode = status;
    res.end(JSON.stringify(result));
  };

  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/api/diagnose', handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/diagnose', handle);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [localApi(env)],
    build: {
      chunkSizeWarningLimit: 1000,
    },
  };
});
