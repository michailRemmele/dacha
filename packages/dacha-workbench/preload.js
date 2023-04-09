const { contextBridge, ipcRenderer } = require('electron')
const path = require('path')
const fs = require('fs')

const MESSAGES = require('./electron/messages')

const editorConfig = require(path.resolve(process.env.EDITOR_CONFIG))

contextBridge.exposeInMainWorld('electron', {
  getProjectConfig: () => {
    const configData = fs.readFileSync(path.resolve(editorConfig.projectConfig))

    return JSON.parse(configData)
  },
  getEditorConfig: () => editorConfig,
  getExtension: () => {
    if (editorConfig.extension) {
      return fs.readFileSync(path.resolve(editorConfig.extension)).toString('utf8')
    }

    return undefined
  },
  saveProjectConfig: (config) => {
    fs.writeFileSync(path.resolve(editorConfig.projectConfig), JSON.stringify(config, null, 2))
  },
  onSave: (callback) => ipcRenderer.on(MESSAGES.SAVE, callback),
})
