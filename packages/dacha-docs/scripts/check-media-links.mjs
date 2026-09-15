import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dist = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../dist',
);

const MEDIA_URL =
  /https?:\/\/[^\s"'<>()]+\.(?:mp4|webm|mov|m4v|ogg|mp3|wav|png|jpe?g|gif|webp|avif|svg)\b/gi;

async function* htmlFiles(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    console.error(`No build output at ${dist}. Run "npm run build" first.`);
    process.exit(1);
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* htmlFiles(full);
    } else if (entry.name.endsWith('.html')) {
      yield full;
    }
  }
}

const urls = new Map();

for await (const file of htmlFiles(dist)) {
  const html = await readFile(file, 'utf8');
  for (const [url] of html.matchAll(MEDIA_URL)) {
    if (!urls.has(url)) {
      urls.set(url, path.relative(dist, file));
    }
  }
}

if (urls.size === 0) {
  console.warn('No externally hosted media referenced by the built site.');
  process.exit(0);
}

async function attempt(url) {
  const head = await fetch(url, { method: 'HEAD', redirect: 'follow' });
  if (head.ok) {
    return { ok: true, status: head.status };
  }
  const ranged = await fetch(url, {
    headers: { Range: 'bytes=0-0' },
    redirect: 'follow',
  });
  return { ok: ranged.ok, status: ranged.status };
}

const ATTEMPTS = 3;

async function probe(url) {
  for (let attemptNumber = 1; ; attemptNumber += 1) {
    try {
      return await attempt(url);
    } catch (error) {
      if (attemptNumber === ATTEMPTS) {
        return { ok: false, status: error.message };
      }
      await new Promise((resolve) => setTimeout(resolve, attemptNumber * 500));
    }
  }
}

const results = await Promise.all(
  [...urls].map(async ([url, page]) => ({ url, page, ...(await probe(url)) })),
);

const broken = results.filter((result) => !result.ok);

for (const { url, status, ok } of results.sort((a, b) =>
  a.url.localeCompare(b.url),
)) {
  console.warn(`${ok ? 'ok  ' : 'FAIL'} ${status}\t${url}`);
}

if (broken.length > 0) {
  console.error(
    `\n${broken.length} of ${results.length} media URLs are unreachable:`,
  );
  for (const { url, page, status } of broken) {
    console.error(`  ${url}\n    referenced by ${page} (${status})`);
  }
  process.exit(1);
}

console.warn(
  `\nAll ${results.length} externally hosted media URLs are reachable.`,
);
