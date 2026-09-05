import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const direction = process.argv[2];

if (direction !== 'pull' && direction !== 'push') {
  console.error('Usage: node scripts/media.mjs <pull|push>');
  process.exit(1);
}

const bucket = process.env.S3_DOCS_BUCKET;
const endpoint = process.env.S3_ENDPOINT;
const profile = process.env.S3_DOCS_PROFILE;

if (!bucket || !endpoint) {
  console.error(
    'S3_DOCS_BUCKET and S3_ENDPOINT environment variables are required.\n' +
      'Run "source .env.local" from the repository root first.',
  );
  process.exit(1);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const local = `${path.resolve(here, '../media')}/`;
const remote = `s3://${bucket}/`;

const [source, dest] = direction === 'push' ? [local, remote] : [remote, local];

execFileSync(
  'aws',
  [
    's3',
    'sync',
    source,
    dest,
    '--endpoint-url',
    endpoint,
    ...(profile ? ['--profile', profile] : []),
    ...(direction === 'push'
      ? ['--cache-control', 'public, max-age=86400']
      : []),
  ],
  { stdio: 'inherit' },
);
