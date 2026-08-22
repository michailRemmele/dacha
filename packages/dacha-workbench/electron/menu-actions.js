const { app, clipboard } = require('electron');

const MESSAGES = require('./messages');

const save = (window) => window.webContents.send(MESSAGES.SAVE);

const undo = (window) => window.webContents.send(MESSAGES.UNDO);

const redo = (window) => window.webContents.send(MESSAGES.REDO);

const cut = (window) => {
  if (window.webContents.isDevToolsFocused()) {
    window.webContents.devToolsWebContents?.cut?.();
    return;
  }

  window.webContents.send(MESSAGES.CUT);
};

const copy = (window) => {
  if (window.webContents.isDevToolsFocused()) {
    window.webContents.devToolsWebContents?.copy?.();
    return;
  }

  window.webContents.send(MESSAGES.COPY);
};

const paste = (window) => {
  if (window.webContents.isDevToolsFocused()) {
    window.webContents.devToolsWebContents?.paste?.();
    return;
  }

  window.webContents.send(MESSAGES.PASTE, clipboard.readText());
};

const deleteSelection = (window) => {
  if (window.webContents.isDevToolsFocused()) {
    return;
  }

  window.webContents.send(MESSAGES.DELETE);
};

const openSettings = (window, type) =>
  window.webContents.send(MESSAGES.SETTINGS, type);

const toggleDebugLayer = (window, id, enabled) =>
  window.webContents.send(MESSAGES.TOGGLE_DEBUG_LAYER, id, enabled);

const switchTheme = (window, preference) =>
  window.webContents.send(MESSAGES.SWITCH_THEME, preference);

const quit = () => app.quit();

module.exports = {
  save,
  undo,
  redo,
  cut,
  copy,
  paste,
  deleteSelection,
  openSettings,
  toggleDebugLayer,
  switchTheme,
  quit,
};
