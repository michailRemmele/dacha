const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const { saveFile, readFile } = require('./file-system')
const getEditorConfig = require('./utils/get-editor-config')

const { projectConfig } = getEditorConfig()

const PROJECT_UPDATE_HASH_PATH = '.dacha/hash'

const saveProjectConfig = (config) => {
  const data = JSON.stringify(config, null, 2)

  const hashSum = crypto.createHash('sha256')
  hashSum.update(Buffer.from(data))

  saveFile(PROJECT_UPDATE_HASH_PATH, hashSum.digest('hex'))

  fs.writeFileSync(
    path.resolve(projectConfig),
    data,
  )
}

const getProjectConfig = () => {
  const configData = fs.readFileSync(path.resolve(projectConfig))

  return JSON.parse(configData)
}

const getLastUpdateHash = () => {
  const hash = readFile(PROJECT_UPDATE_HASH_PATH)

  return hash ? hash.toString('utf-8') : undefined
}

const getCurrentHash = () => {
  const fileBuffer = fs.readFileSync(path.resolve(projectConfig))

  if (fileBuffer.length === 0) {
    throw new Error('Error while calculating project config hash. File is empty')
  }

  const hashSum = crypto.createHash('sha256')
  hashSum.update(fileBuffer)

  return hashSum.digest('hex')
}

module.exports = {
  saveProjectConfig,
  getProjectConfig,
  getLastUpdateHash,
  getCurrentHash,
}
