const { contextBridge } = require('electron')
const path = require('path')
const fs = require('fs')

const editorConfig = require(path.resolve(process.env.EDITOR_CONFIG))

contextBridge.exposeInMainWorld('electron', {
  getProjectConfig: () => {
    const configData = fs.readFileSync(path.resolve(editorConfig.projectConfig))

    return JSON.parse(configData)
  },
  getEditorConfig: () => editorConfig,
  getExtension: () => {
    const extensionPath = path.resolve(editorConfig.extension)

    if (extensionPath) {
      return fs.readFileSync(path.resolve(editorConfig.extension)).toString('utf8')
    }

    return undefined
  },
})
