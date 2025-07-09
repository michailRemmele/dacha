const fs = require('fs')

const { getCurrentHash, getLastUpdateHash } = require('./project-config')

const watchProjectConfig = (path, window) => {
  fs.watch(path, (eventType) => {
    if (eventType !== 'change') {
      return
    }

    try {
      if (getCurrentHash() !== getLastUpdateHash()) {
        window.webContents.reload()
      }
    } catch (error) {
      console.warn(error)
    }
  })
}

module.exports = watchProjectConfig
