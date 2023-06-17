const { dialog } = require('electron')
const path = require('path')

module.exports = async (assetsPath, extensions) => {
  const result = await dialog.showOpenDialog({
    defaultPath: assetsPath,
    properties: ['openFile'],
    filters: extensions !== undefined ? [
      { name: 'Assets', extensions },
    ] : [],
  })

  return result.filePaths[0] ? path.posix.relative(assetsPath, result.filePaths[0]) : undefined
}
