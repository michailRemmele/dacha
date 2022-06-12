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
})
