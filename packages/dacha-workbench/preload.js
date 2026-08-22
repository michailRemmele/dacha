const { contextBridge, ipcRenderer } = require('electron');

const MESSAGES = require('./electron/messages');
const getEditorConfig = require('./electron/get-editor-config');
const {
  saveProjectConfig,
  getProjectConfig,
} = require('./electron/project-config');
const {
  savePersistentStorage,
  loadPersistentStorage,
} = require('./electron/persistent-storage');
const createSystem = require('./electron/script-templates/create-system');
const createComponent = require('./electron/script-templates/create-component');
const createBehavior = require('./electron/script-templates/create-behavior');

const editorConfig = getEditorConfig();

contextBridge.exposeInMainWorld('electron', {
  getEditorConfig: () => editorConfig,
  getPlatform: () => process.platform,
  getProjectConfig,
  saveProjectConfig,
  loadPersistentStorage,
  savePersistentStorage,
  createSystem: createSystem(editorConfig),
  createComponent: createComponent(editorConfig),
  createBehavior: createBehavior(editorConfig),
  openAssetsDialog: (extensions) =>
    ipcRenderer.invoke(MESSAGES.ASSETS_DIALOG, extensions),
  openPathSelectionDialog: () => ipcRenderer.invoke(MESSAGES.PATH_DIALOG),
  setUnsavedChanges: (unsavedChanges) => {
    ipcRenderer.send(MESSAGES.SET_UNSAVED_CHANGES, unsavedChanges);
  },
  triggerSave: () => ipcRenderer.send(MESSAGES.SAVE),
  triggerUndo: () => ipcRenderer.send(MESSAGES.UNDO),
  triggerRedo: () => ipcRenderer.send(MESSAGES.REDO),
  triggerCut: () => ipcRenderer.send(MESSAGES.CUT),
  triggerCopy: () => ipcRenderer.send(MESSAGES.COPY),
  triggerPaste: () => ipcRenderer.send(MESSAGES.PASTE),
  triggerDelete: () => ipcRenderer.send(MESSAGES.DELETE),
  openSettings: (type) => ipcRenderer.send(MESSAGES.SETTINGS, type),
  toggleDebugLayer: (id, enabled) =>
    ipcRenderer.send(MESSAGES.TOGGLE_DEBUG_LAYER, id, enabled),
  switchTheme: (preference) =>
    ipcRenderer.send(MESSAGES.SWITCH_THEME, preference),
  quitApp: () => ipcRenderer.send(MESSAGES.QUIT_APP),
  minimizeWindow: () => ipcRenderer.send(MESSAGES.WINDOW_MINIMIZE),
  toggleMaximizeWindow: () =>
    ipcRenderer.send(MESSAGES.WINDOW_MAXIMIZE_TOGGLE),
  closeWindow: () => ipcRenderer.send(MESSAGES.WINDOW_CLOSE),
  onWindowStateChanged: (callback) => {
    const handler = (_, isMaximized) => callback(isMaximized);
    ipcRenderer.on(MESSAGES.WINDOW_STATE_CHANGED, handler);
    return () => ipcRenderer.removeListener(MESSAGES.WINDOW_STATE_CHANGED, handler);
  },
  onSave: (callback) => ipcRenderer.on(MESSAGES.SAVE, callback),
  onSettings: (callback) =>
    ipcRenderer.on(MESSAGES.SETTINGS, (_, ...args) => callback(...args)),
  onSwitchTheme: (callback) => {
    const handler = (_, ...args) => callback(...args);
    ipcRenderer.on(MESSAGES.SWITCH_THEME, handler);
    return () => ipcRenderer.removeListener(MESSAGES.SWITCH_THEME, handler);
  },
  onUndo: (callback) => {
    ipcRenderer.on(MESSAGES.UNDO, callback);
    return () => ipcRenderer.removeListener(MESSAGES.UNDO, callback);
  },
  onRedo: (callback) => {
    ipcRenderer.on(MESSAGES.REDO, callback);
    return () => ipcRenderer.removeListener(MESSAGES.REDO, callback);
  },
  onCut: (callback) => {
    ipcRenderer.on(MESSAGES.CUT, callback);
    return () => ipcRenderer.removeListener(MESSAGES.CUT, callback);
  },
  onCopy: (callback) => {
    ipcRenderer.on(MESSAGES.COPY, callback);
    return () => ipcRenderer.removeListener(MESSAGES.COPY, callback);
  },
  onPaste: (callback) => {
    const handler = (_, ...args) => callback(...args);
    ipcRenderer.on(MESSAGES.PASTE, handler);
    return () => ipcRenderer.removeListener(MESSAGES.PASTE, handler);
  },
  onDelete: (callback) => {
    ipcRenderer.on(MESSAGES.DELETE, callback);
    return () => ipcRenderer.removeListener(MESSAGES.DELETE, callback);
  },
  onToggleDebugLayer: (callback) => {
    const handler = (_, ...args) => callback(...args);
    ipcRenderer.on(MESSAGES.TOGGLE_DEBUG_LAYER, handler);
    return () =>
      ipcRenderer.removeListener(MESSAGES.TOGGLE_DEBUG_LAYER, handler);
  },
  onExtensionBuildStart: (callback) => {
    ipcRenderer.on(MESSAGES.EXTENSION_BUILD_START, callback);
    return () =>
      ipcRenderer.removeListener(MESSAGES.EXTENSION_BUILD_START, callback);
  },
  onExtensionBuildEnd: (callback) => {
    ipcRenderer.on(MESSAGES.EXTENSION_BUILD_END, callback);
    return () =>
      ipcRenderer.removeListener(MESSAGES.EXTENSION_BUILD_END, callback);
  },
  onNeedsUpdate: (callback) => {
    ipcRenderer.on(MESSAGES.NEEDS_UPDATE, callback);
    return () => ipcRenderer.removeListener(MESSAGES.NEEDS_UPDATE, callback);
  },
});
