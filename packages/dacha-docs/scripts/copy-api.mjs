import { cp, rm, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const source = path.resolve(here, '../../dacha/docs');
const target = path.resolve(here, '../public/api');

try {
  await access(source);
} catch {
  console.error(
    `Typedoc output not found at ${source}.\nRun "npm run docs -w dacha" first.`,
  );
  process.exit(1);
}

await rm(target, { recursive: true, force: true });
await cp(source, target, { recursive: true });

console.warn(`Copied typedoc output into ${target}`);
