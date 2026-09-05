import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const apiBase = String(process.env.API_BASE_URL || '').replace(/\/+$/, '');

if (!/^https?:\/\/[^"'<>]+$/.test(apiBase)) {
  throw new Error('API_BASE_URL must be set to a valid http(s) backend URL.');
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all([
  cp(resolve(root, 'index.html'), resolve(output, 'index.html')),
  cp(resolve(root, 'css'), resolve(output, 'css'), { recursive: true }),
  cp(resolve(root, 'js'), resolve(output, 'js'), { recursive: true }),
]);
await writeFile(
  resolve(output, 'config.js'),
  `window.NEXTSTEP_CONFIG = ${JSON.stringify({ API_BASE: apiBase })};\n`,
);

console.log(`Built frontend for ${apiBase}`);
