/**
 * Injects Supabase config into index.html (inline) and public/env-config.js
 * before CRA build. Inline script survives Vercel SPA rewrites that were
 * incorrectly serving index.html for /env-config.js.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = path.join(root, 'public', 'env-config.js');
const indexPath = path.join(root, 'public', 'index.html');

function readDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const vars = {};
  fs.readFileSync(filePath, 'utf8').split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const i = trimmed.indexOf('=');
    if (i === -1) return;
    vars[trimmed.slice(0, i).trim()] = trimmed.slice(i + 1).trim();
  });
  return vars;
}

const fromProduction = readDotEnv(path.join(root, '.env.production'));
const fromLocal = readDotEnv(path.join(root, '.env'));
const fromFile = { ...fromLocal, ...fromProduction };
const config = {
  REACT_APP_SUPABASE_URL:
    process.env.REACT_APP_SUPABASE_URL || fromFile.REACT_APP_SUPABASE_URL || '',
  REACT_APP_SUPABASE_ANON_KEY:
    process.env.REACT_APP_SUPABASE_ANON_KEY || fromFile.REACT_APP_SUPABASE_ANON_KEY || '',
};

const payload = JSON.stringify(config, null, 0);
const inlineScript = `<script id="finops-env">window.__FINOPS_ENV__=${payload};</script>`;

fs.writeFileSync(out, `window.__FINOPS_ENV__=${payload};\n`, 'utf8');

let html = fs.readFileSync(indexPath, 'utf8');
html = html.replace(/<!-- @finops-env@ -->|<script id="finops-env">[\s\S]*?<\/script>/, inlineScript);
fs.writeFileSync(indexPath, html, 'utf8');

if (!config.REACT_APP_SUPABASE_URL || !config.REACT_APP_SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.warn('[FinOps360] Warning: Supabase env missing — production will run in demo mode.');
} else {
  // eslint-disable-next-line no-console
  console.log('[FinOps360] Supabase env injected for', config.REACT_APP_SUPABASE_URL);
}
