const fs = require('fs')

const { getCurrentHash, getLastUpdateHash } = require('./project-config')

const watchProjectConfig = (path, window) => {
  fs.watch(path, (eventType) => {
    if (eventType !== 'change') {
      return
    }

    if (getCurrentHash() !== getLastUpdateHash()) {
      window.webContents.reload()
    }
  })
}

module.exports = watchProjectConfig
