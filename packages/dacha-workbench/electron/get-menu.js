const {
  app,
  Menu,
} = require('electron')

const MESSAGES = require('./messages')

module.exports = (window) => Menu.buildFromTemplate([
  {
    label: app.name,
    submenu: [
      { role: 'quit' },
    ],
  },
  {
    role: 'fileMenu',
    submenu: [
      {
        label: 'Save',
        accelerator: process.platform === 'darwin' ? 'Cmd+S' : 'Ctrl+S',
        click: () => window.webContents.send(MESSAGES.SAVE),
      },
    ],
  },
  {
    role: 'editMenu',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },

      { type: 'separator' },

      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'delete' },
      { role: 'selectAll' },
    ],
  },
  {
    role: 'viewMenu',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },

      { type: 'separator' },

      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },

      { type: 'separator' },

      { role: 'togglefullscreen' },
    ],
  },
])
