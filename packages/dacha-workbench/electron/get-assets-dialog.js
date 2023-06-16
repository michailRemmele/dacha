const { dialog } = require('electron')
const path = require('path')

module.exports = async (assetsPath) => {
  const result = await dialog.showOpenDialog({
    defaultPath: assetsPath,
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['png'] },
    ],
  })

  return result.filePaths[0] ? path.posix.relative(assetsPath, result.filePaths[0]) : undefined
}
