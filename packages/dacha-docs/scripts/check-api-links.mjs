import { access, readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dist = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../dist',
);
const apiDir = path.join(dist, 'api');

const SITE = 'https://dachajs.org';

const GUIDE_TO_API = /href="(\/api\/[^"#?]*)/g;
const API_TO_GUIDE = /href="https:\/\/dachajs\.org(\/[^"#?]*)/g;

async function* htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* htmlFiles(full);
    } else if (entry.name.endsWith('.html')) {
      yield full;
    }
  }
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function resolves(sitePath) {
  const target = path.join(dist, decodeURIComponent(sitePath));
  if (sitePath.endsWith('/')) {
    return exists(path.join(target, 'index.html'));
  }
  return (await exists(target)) || exists(path.join(target, 'index.html'));
}

try {
  await access(apiDir);
} catch {
  console.error(
    `No API reference at ${apiDir}. Run "npm run api:copy" and "npm run build" first.`,
  );
  process.exit(1);
}

const links = new Map();

for await (const file of htmlFiles(dist)) {
  const page = path.relative(dist, file);
  const isApiPage = file.startsWith(apiDir + path.sep);
  const html = await readFile(file, 'utf8');
  const pattern = isApiPage ? API_TO_GUIDE : GUIDE_TO_API;
  for (const [, sitePath] of html.matchAll(pattern)) {
    if (!links.has(sitePath)) {
      links.set(sitePath, page);
    }
  }
}

const broken = [];
for (const [sitePath, page] of links) {
  if (!(await resolves(sitePath))) {
    broken.push({ sitePath, page });
  }
}

if (broken.length > 0) {
  console.error(
    `${broken.length} of ${links.size} links between the guide and the API reference are broken:`,
  );
  for (const { sitePath, page } of broken) {
    const shown = sitePath.startsWith('/api/') ? sitePath : SITE + sitePath;
    console.error(`  ${shown}\n    referenced by ${page}`);
  }
  process.exit(1);
}

console.warn(
  `All ${links.size} links between the guide and the API reference resolve.`,
);
