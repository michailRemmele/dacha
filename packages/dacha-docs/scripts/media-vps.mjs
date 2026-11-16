import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/*
 * Uploads the local media copy to the host that serves the site.
 *
 * Usage: node scripts/media-vps.mjs [--dry-run]
 */

const host = process.env.VPS_HOST;
const user = process.env.VPS_USER;
const port = process.env.VPS_PORT || '22';
const remote = process.env.REMOTE_MEDIA || '/srv/sites/dachajs/shared/media';
const dryRun = process.argv.includes('--dry-run');

if (!host || !user) {
  console.error(
    'VPS_HOST and VPS_USER environment variables are required.\n' +
      'Run "source .env.local" from the repository root first.',
  );
  process.exit(1);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const local = path.resolve(here, '../media');

if (!existsSync(path.join(local, 'video'))) {
  console.error(`No ${local}/video directory. Nothing to sync.`);
  process.exit(1);
}

const ssh = ['ssh', '-p', port];
const target = `${user}@${host}`;
const run = (command, args) =>
  execFileSync(command, args, { stdio: 'inherit' });

console.warn(`==> ${local}/video  ->  ${target}:${remote}`);

if (!dryRun) {
  run(ssh[0], [...ssh.slice(1), target, `mkdir -p '${remote}'`]);
}

// --delete keeps the server from accumulating clips the pages no longer use.
// Permissions are fixed in a separate step, because macOS ships openrsync,
// which does not take --chmod.
run('rsync', [
  '-av',
  '--delete',
  '--exclude',
  '.DS_Store',
  ...(dryRun ? ['--dry-run'] : []),
  '-e',
  ssh.join(' '),
  `${local}/video`,
  `${target}:${remote}/`,
]);

if (dryRun) {
  console.warn('Dry run finished. Nothing was written.');
  process.exit(0);
}

// Caddy runs as its own user, so what was just uploaded has to be readable by
// it whatever the local and remote umasks were.
run(ssh[0], [...ssh.slice(1), target, `chmod -R a+rX '${remote}'`]);
