const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  create,
  toPackageName,
  isEmptyDir,
  TEMPLATE_DIR,
} = require('../lib/create');

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'create-dacha-'));

test('toPackageName lowercases and replaces illegal characters', () => {
  assert.strictEqual(toPackageName('My Game'), 'my-game');
  assert.strictEqual(toPackageName('My_Game!'), 'my-game-');
  assert.strictEqual(toPackageName('my-game'), 'my-game');
});

test('isEmptyDir treats a missing directory as empty', () => {
  const dir = path.join(tmp(), 'missing');
  assert.strictEqual(isEmptyDir(dir), true);
});

test('isEmptyDir reports a directory with contents as non-empty', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'file.txt'), 'x');
  assert.strictEqual(isEmptyDir(dir), false);
});

test('create copies the template into the target directory', () => {
  const dir = path.join(tmp(), 'my-game');

  create({ targetDir: dir, projectName: 'my-game' });

  assert.ok(fs.existsSync(path.join(dir, 'package.json')));
  assert.ok(fs.existsSync(path.join(dir, 'src', 'index.ts')));
  assert.ok(fs.existsSync(path.join(dir, 'data', 'data.json')));
});

test('create renames _gitignore to .gitignore', () => {
  const dir = path.join(tmp(), 'my-game');

  create({ targetDir: dir, projectName: 'my-game' });

  assert.ok(fs.existsSync(path.join(dir, '.gitignore')));
  assert.ok(!fs.existsSync(path.join(dir, '_gitignore')));
});

test('create writes the project name into package.json', () => {
  const dir = path.join(tmp(), 'my-game');

  create({ targetDir: dir, projectName: 'My Game' });

  const manifest = JSON.parse(
    fs.readFileSync(path.join(dir, 'package.json'), 'utf8'),
  );
  assert.strictEqual(manifest.name, 'my-game');
});

test('create names the package after the target directory, not the path', () => {
  const dir = path.join(tmp(), 'nested', 'my-game');

  create({ targetDir: dir });

  const manifest = JSON.parse(
    fs.readFileSync(path.join(dir, 'package.json'), 'utf8'),
  );
  assert.strictEqual(manifest.name, 'my-game');
});

test('create does not copy OS junk files out of the template', () => {
  const junk = path.join(TEMPLATE_DIR, '.DS_Store');
  fs.writeFileSync(junk, 'junk');

  const dir = path.join(tmp(), 'my-game');
  try {
    create({ targetDir: dir });
  } finally {
    fs.rmSync(junk, { force: true });
  }

  assert.ok(!fs.existsSync(path.join(dir, '.DS_Store')));
});

test('create refuses a non-empty target directory', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'file.txt'), 'x');

  assert.throws(
    () => create({ targetDir: dir, projectName: 'my-game' }),
    /not empty/,
  );
});
