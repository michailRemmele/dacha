const { contextBridge, ipcRenderer } = require('electron')
const path = require('path')
const fs = require('fs')

const MESSAGES = require('./electron/messages')
const getEditorConfig = require('./electron/utils/get-editor-config')

const editorConfig = getEditorConfig()
const isDev = process.env.NODE_ENV === 'development'

contextBridge.exposeInMainWorld('electron', {
  getProjectConfig: () => {
    const configData = fs.readFileSync(path.resolve(editorConfig.projectConfig))

    return JSON.parse(configData)
  },
  getEditorConfig: () => editorConfig,
  isExtensionAvailable: () => Boolean(editorConfig.extensionEntry),
  openAssetsDialog: (extensions) => ipcRenderer.invoke(MESSAGES.ASSETS_DIALOG, extensions),
  saveProjectConfig: (config) => {
    fs.writeFileSync(
      path.resolve(editorConfig.projectConfig),
      JSON.stringify(config, null, isDev ? 2 : 0),
    )
  },
  setUnsavedChanges: (unsavedChanges) => {
    ipcRenderer.send(MESSAGES.SET_UNSAVED_CHANGES, unsavedChanges)
  },
  onSave: (callback) => ipcRenderer.on(MESSAGES.SAVE, callback),
  onSettings: (callback) => ipcRenderer.on(MESSAGES.SETTINGS, (_, ...args) => callback(...args)),
  onSwitchTheme: (callback) => {
    ipcRenderer.on(MESSAGES.SWITCH_THEME, callback)
    return () => ipcRenderer.removeListener(MESSAGES.SWITCH_THEME, callback)
  },
  onUndo: (callback) => {
    ipcRenderer.on(MESSAGES.UNDO, callback)
    return () => ipcRenderer.removeListener(MESSAGES.UNDO, callback)
  },
  onRedo: (callback) => {
    ipcRenderer.on(MESSAGES.REDO, callback)
    return () => ipcRenderer.removeListener(MESSAGES.REDO, callback)
  },
})
