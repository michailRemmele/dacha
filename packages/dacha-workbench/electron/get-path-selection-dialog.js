const { dialog } = require('electron')
const path = require('path')

const normalizePath = require('./utils/normilize-path')

module.exports = async () => {
  const root = normalizePath('.')

  const result = await dialog.showOpenDialog({
    defaultPath: root,
    properties: ['openDirectory'],
  })

  if (!result.filePaths[0]) {
    return undefined
  }

  const relativePlatformPath = path.relative(root, result.filePaths[0])

  // It is forbidden to select file outside of assets folder
  // On Windows relative path can be calculated as absolute if file is on another drive
  if (relativePlatformPath.startsWith('..') || path.isAbsolute(relativePlatformPath)) {
    return undefined
  }

  return relativePlatformPath.split(path.sep).join(path.posix.sep)
}
