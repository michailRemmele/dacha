const { saveFile } = require('../file-system')

const createComponent = (editorConfig) => (name, path) => {
  const template = editorConfig.templates.component(name)
  saveFile(path, template)
}

module.exports = createComponent
