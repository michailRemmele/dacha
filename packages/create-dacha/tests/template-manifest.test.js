const test = require('node:test');
const assert = require('node:assert');

const { setTemplateVersions } = require('../lib/template-manifest');

test('setTemplateVersions pins both dacha packages', () => {
  const manifest = {
    name: 'template',
    dependencies: { dacha: '0.0.0', 'dacha-workbench': '0.0.0', vite: '7.0.0' },
  };

  const result = setTemplateVersions(manifest, '0.20.0');

  assert.strictEqual(result.dependencies.dacha, '0.20.0');
  assert.strictEqual(result.dependencies['dacha-workbench'], '0.20.0');
});

test('setTemplateVersions leaves other dependencies alone', () => {
  const manifest = {
    dependencies: { dacha: '0.0.0', 'dacha-workbench': '0.0.0', vite: '7.0.0' },
  };

  const result = setTemplateVersions(manifest, '0.20.0');

  assert.strictEqual(result.dependencies.vite, '7.0.0');
});

test('setTemplateVersions does not mutate its input', () => {
  const manifest = { dependencies: { dacha: '0.0.0', 'dacha-workbench': '0.0.0' } };

  setTemplateVersions(manifest, '0.20.0');

  assert.strictEqual(manifest.dependencies.dacha, '0.0.0');
});
