const path = require('path');

const TEMPLATE_MANIFEST_PATH = path.join(
  __dirname,
  '..',
  'templates',
  'minimal',
  'package.json',
);

const PINNED = ['dacha', 'dacha-workbench'];

const setTemplateVersions = (manifest, version) => {
  const dependencies = { ...manifest.dependencies };

  PINNED.forEach((name) => {
    if (dependencies[name] !== undefined) {
      dependencies[name] = version;
    }
  });

  return { ...manifest, dependencies };
};

module.exports = { TEMPLATE_MANIFEST_PATH, setTemplateVersions };
