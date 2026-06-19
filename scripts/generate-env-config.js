/**
 * Writes public/env-config.js before CRA build so Vercel/production always
 * has Supabase credentials available at runtime (not only via CRA env injection).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = path.join(root, 'public', 'env-config.js');

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

fs.writeFileSync(
  out,
  `window.__FINOPS_ENV__=${JSON.stringify(config, null, 0)};\n`,
  'utf8',
);

if (!config.REACT_APP_SUPABASE_URL || !config.REACT_APP_SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.warn('[FinOps360] Warning: Supabase env missing — production will run in demo mode.');
} else {
  // eslint-disable-next-line no-console
  console.log('[FinOps360] env-config.js generated for', config.REACT_APP_SUPABASE_URL);
}
