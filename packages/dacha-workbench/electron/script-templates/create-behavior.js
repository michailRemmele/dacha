const { saveFile } = require('../file-system')

const createBehavior = (editorConfig) => (name, path) => {
  const template = editorConfig.templates.behavior(name)
  saveFile(path, template)
}

module.exports = createBehavior
