const { contextBridge, ipcRenderer } = require('electron')

const MESSAGES = require('./electron/messages')
const getEditorConfig = require('./electron/utils/get-editor-config')
const { saveProjectConfig, getProjectConfig } = require('./electron/project-config')
const { savePersistentStorage, loadPersistentStorage } = require('./electron/persistent-storage')

const editorConfig = getEditorConfig()

contextBridge.exposeInMainWorld('electron', {
  getEditorConfig: () => editorConfig,
  getProjectConfig,
  saveProjectConfig,
  loadPersistentStorage,
  savePersistentStorage,
  isExtensionAvailable: () => Boolean(editorConfig.extensionEntry),
  openAssetsDialog: (extensions) => ipcRenderer.invoke(MESSAGES.ASSETS_DIALOG, extensions),
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
  onCut: (callback) => {
    ipcRenderer.on(MESSAGES.CUT, callback)
    return () => ipcRenderer.removeListener(MESSAGES.CUT, callback)
  },
  onCopy: (callback) => {
    ipcRenderer.on(MESSAGES.COPY, callback)
    return () => ipcRenderer.removeListener(MESSAGES.COPY, callback)
  },
  onPaste: (callback) => {
    ipcRenderer.on(MESSAGES.PASTE, callback)
    return () => ipcRenderer.removeListener(MESSAGES.PASTE, callback)
  },
  onDelete: (callback) => {
    ipcRenderer.on(MESSAGES.DELETE, callback)
    return () => ipcRenderer.removeListener(MESSAGES.DELETE, callback)
  },
})
