const path = require('path')

const normalizePath = (inputPath) => {
  if (!inputPath || path.isAbsolute(inputPath)) {
    return inputPath
  }

  return path.resolve(process.env.ORIGINAL_CWD, inputPath)
}

const getEditorConfig = () => {
  const config = require(path.resolve(process.env.EDITOR_CONFIG))

  return {
    ...config,
    projectConfig: normalizePath(config.projectConfig),
    assets: normalizePath(config.assets),
    extensionEntry: normalizePath(config.extensionEntry),
  }
}

module.exports = getEditorConfig
