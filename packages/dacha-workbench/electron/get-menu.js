const {
  app,
  Menu,
} = require('electron')

const MESSAGES = require('./messages')

const isDev = process.env.NODE_ENV === 'development'

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
      {
        label: 'Undo',
        accelerator: process.platform === 'darwin' ? 'Cmd+Z' : 'Ctrl+Z',
        click: () => window.webContents.send(MESSAGES.UNDO),
      },
      {
        label: 'Redo',
        accelerator: process.platform === 'darwin' ? 'Cmd+Shift+Z' : 'Ctrl+Shift+Z',
        click: () => window.webContents.send(MESSAGES.REDO),
      },

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
      isDev && { role: 'reload' },
      isDev && { role: 'forceReload' },
      { role: 'toggleDevTools' },

      { type: 'separator' },

      {
        label: 'Grid Settings',
        click: () => window.webContents.send(MESSAGES.SETTINGS, 'grid'),
      },

      { type: 'separator' },

      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },

      { type: 'separator' },

      { role: 'togglefullscreen' },

      { type: 'separator' },

      {
        label: 'Switch Theme',
        click: () => window.webContents.send(MESSAGES.SWITCH_THEME, 'grid'),
      },
    ].filter(Boolean),
  },
])
