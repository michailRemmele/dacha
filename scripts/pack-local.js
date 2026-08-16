#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PACKS_DIR = path.join(ROOT, 'packs');
const PACKAGES = ['dacha', 'dacha-workbench'];

const run = (command, cwd = ROOT) => {
  execSync(command, { cwd, stdio: 'inherit' });
};

const getVersion = (name) => {
  const manifest = path.join(ROOT, 'packages', name, 'package.json');
  return JSON.parse(fs.readFileSync(manifest, 'utf8')).version;
};

const getTargetProject = () => {
  const index = process.argv.indexOf('--to');
  return index === -1 ? undefined : process.argv[index + 1];
};

const target = getTargetProject();

run('npm run build');

fs.rmSync(PACKS_DIR, { recursive: true, force: true });
fs.mkdirSync(PACKS_DIR);

run(
  `npm pack ${PACKAGES.map((name) => `-w ${name}`).join(' ')} --pack-destination ${PACKS_DIR}`,
);

const archives = PACKAGES.map((name) =>
  path.join(PACKS_DIR, `${name}-${getVersion(name)}.tgz`),
);

archives.forEach((archive) => {
  if (!fs.existsSync(archive)) {
    throw new Error(`Expected archive is missing: ${archive}`);
  }
});

if (target) {
  const targetPath = path.resolve(target);
  console.warn(`\nInstalling into ${targetPath}`);
  run(`npm i ${archives.join(' ')}`, targetPath);
} else {
  console.warn('\nInstall into a project with:\n');
  console.warn(`  npm i ${archives.join(' ')}\n`);
}
