#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PACKAGES = ['dacha', 'dacha-workbench'];

const run = (command) => execSync(command, { cwd: ROOT, stdio: 'inherit' });
const read = (command) =>
  execSync(command, { cwd: ROOT, encoding: 'utf8' }).trim();

const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version)) {
  throw new Error('Usage: npm run release <version>, e.g. 0.19.0-alpha.3');
}

if (read('git status --porcelain')) {
  throw new Error('Working tree is dirty');
}
if (read('git rev-parse --abbrev-ref HEAD') !== 'main') {
  throw new Error('Release must be run from main');
}

run('npm whoami');
run('npm run lint');
run('npm test');
run('npm run build');

const manifestPath = (name) =>
  path.join(ROOT, 'packages', name, 'package.json');

const readManifest = (name) =>
  JSON.parse(fs.readFileSync(manifestPath(name), 'utf8'));

const writeManifest = (name, manifest) =>
  fs.writeFileSync(
    manifestPath(name),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

PACKAGES.forEach((name) => {
  const manifest = readManifest(name);
  manifest.version = version;

  if (manifest.devDependencies?.dacha) {
    manifest.devDependencies.dacha = version;
  }

  writeManifest(name, manifest);
});

run('npm i --package-lock-only');

run('git add -A');
run(`git commit -m "chore: release v${version}"`);
run(`git tag v${version}`);

const prereleaseId = version.includes('-')
  ? version.split('-')[1].split('.')[0]
  : '';
const npmTag = prereleaseId ? ` --tag ${prereleaseId}` : '';

PACKAGES.forEach((name) => {
  run(`npm publish -w ${name}${npmTag}`);
});

run('git push --follow-tags');

console.warn(
  `\nReleased v${version}${prereleaseId ? ` under the ${prereleaseId} tag` : ''}`,
);

if (!npmTag) {
  console.warn(
    '\nThis was a stable release. The `alpha` dist-tag still points at the last prerelease;',
  );
  console.warn('remove it if it is no longer meant to be installable:');
  PACKAGES.forEach((name) => {
    console.warn(`  npm dist-tag rm ${name} alpha`);
  });
}
