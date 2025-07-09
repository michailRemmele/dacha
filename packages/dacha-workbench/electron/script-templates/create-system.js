const { saveFile } = require('../file-system')

const createSystem = (editorConfig) => (name, path) => {
  const template = editorConfig.templates.system(name)
  saveFile(path, template)
}

module.exports = createSystem
