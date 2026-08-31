#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PACKS_DIR = path.join(ROOT, 'packs');
const STAGE_DIR = path.join(PACKS_DIR, '.stage');
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

const getStamp = () => {
  const d = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate()),
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds()),
  ].join('');
};

const stampVersion = (version, stamp) =>
  version.includes('-')
    ? `${version}.local.${stamp}`
    : `${version}-local.${stamp}`;

const restampArchive = (archive, name, version) => {
  const stageDir = path.join(STAGE_DIR, name);

  fs.rmSync(stageDir, { recursive: true, force: true });
  fs.mkdirSync(stageDir, { recursive: true });

  execSync(`tar -xzf ${archive} -C ${stageDir}`, { cwd: ROOT });

  const manifestPath = path.join(stageDir, 'package', 'package.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.version = version;
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const stamped = path.join(PACKS_DIR, `${name}-${version}.tgz`);
  execSync(`tar -czf ${stamped} -C ${stageDir} package`, { cwd: ROOT });

  fs.rmSync(archive, { force: true });

  return stamped;
};

const target = getTargetProject();
const stamp = getStamp();

run('npm run build');

fs.rmSync(PACKS_DIR, { recursive: true, force: true });
fs.mkdirSync(PACKS_DIR);

run(
  `npm pack ${PACKAGES.map((name) => `-w ${name}`).join(' ')} --pack-destination ${PACKS_DIR}`,
);

const archives = PACKAGES.map((name) => {
  const archive = path.join(PACKS_DIR, `${name}-${getVersion(name)}.tgz`);

  if (!fs.existsSync(archive)) {
    throw new Error(`Expected archive is missing: ${archive}`);
  }

  return restampArchive(archive, name, stampVersion(getVersion(name), stamp));
});

fs.rmSync(STAGE_DIR, { recursive: true, force: true });

console.warn(`\nArchives are stamped with a unique local version (${stamp}).`);

if (target) {
  const targetPath = path.resolve(target);
  console.warn(`\nInstalling into ${targetPath}`);
  run(`npm i ${archives.join(' ')}`, targetPath);
} else {
  console.warn('\nInstall into a project with:\n');
  console.warn(`  npm i ${archives.join(' ')}\n`);
}
