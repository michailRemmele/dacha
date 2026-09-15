const fs = require('fs');
const path = require('path');

const TEMPLATE_DIR = path.join(__dirname, '..', 'templates', 'minimal');

const RENAME = {
  _gitignore: '.gitignore',
};

const SKIP = new Set(['.DS_Store', 'Thumbs.db']);

const isEmptyDir = (dir) =>
  !fs.existsSync(dir) || fs.readdirSync(dir).length === 0;

const toPackageName = (input) =>
  input
    .trim()
    .toLowerCase()
    .replace(/^[._]+/, '')
    .replace(/[^a-z0-9-~]+/g, '-');

const copyTemplate = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });

  fs.readdirSync(src, { withFileTypes: true }).forEach((entry) => {
    if (SKIP.has(entry.name)) {
      return;
    }

    const from = path.join(src, entry.name);
    const to = path.join(dest, RENAME[entry.name] ?? entry.name);

    if (entry.isDirectory()) {
      copyTemplate(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  });
};

const writeProjectName = (targetDir, projectName) => {
  const manifestPath = path.join(targetDir, 'package.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  manifest.name = toPackageName(projectName);

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
};

const create = ({ targetDir, projectName = path.basename(targetDir) }) => {
  if (!isEmptyDir(targetDir)) {
    throw new Error(`Target directory is not empty: ${targetDir}`);
  }

  copyTemplate(TEMPLATE_DIR, targetDir);
  writeProjectName(targetDir, projectName);
};

module.exports = {
  TEMPLATE_DIR,
  create,
  copyTemplate,
  toPackageName,
  isEmptyDir,
};
