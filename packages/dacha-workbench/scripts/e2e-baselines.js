const { execFileSync } = require('child_process');

const direction = process.argv[2];

if (direction !== 'pull' && direction !== 'push') {
  console.error(`Usage: node scripts/e2e-baselines.js <pull|push>`);
  process.exit(1);
}

const bucket = process.env.S3_BUCKET;
const endpoint = process.env.S3_ENDPOINT;

if (!bucket || !endpoint) {
  console.error('S3_BUCKET and S3_ENDPOINT environment variables are required');
  process.exit(1);
}

const remote = `s3://${bucket}/e2e-screenshots/`;
const local = 'e2e/specs/';

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
    '--exclude',
    '*',
    '--include',
    '*-snapshots/*',
  ],
  { stdio: 'inherit' },
);
