const fs = require('fs')
const path = require('path')

const normalizePath = require('./utils/normilize-path')

const saveFile = (rawPath, data) => {
  const dataPath = normalizePath(rawPath)
  const dataDirname = path.dirname(dataPath)

  if (!fs.existsSync(dataDirname)) {
    fs.mkdirSync(dataDirname, { recursive: true })
  }

  fs.writeFileSync(dataPath, data)
}

const readFile = (rawPath) => {
  const dataPath = normalizePath(rawPath)

  if (!fs.existsSync(dataPath)) {
    return undefined
  }

  return fs.readFileSync(dataPath)
}

module.exports = {
  saveFile,
  readFile,
}
