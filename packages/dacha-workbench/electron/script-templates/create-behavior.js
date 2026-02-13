const { saveFile } = require('../file-system');

const createBehavior = (editorConfig) => (name, path, type) => {
  const template = type
    ? editorConfig.templates[type](name)
    : editorConfig.templates.behavior(name);
  saveFile(path, template);
};

module.exports = createBehavior;
