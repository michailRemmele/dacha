const path = require('path')

const normalizePath = require('./normilize-path')

const getEditorConfig = () => {
  const config = require(path.resolve(process.env.EDITOR_CONFIG))

  return {
    ...config,
    projectConfig: normalizePath(config.projectConfig),
    assets: normalizePath(config.assets),
    extensionEntry: normalizePath(config.extensionEntry),
    formatWidgetNames: config.formatWidgetNames ?? true,
  }
}

module.exports = getEditorConfig
