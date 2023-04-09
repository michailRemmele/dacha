const {
  app,
  Menu,
} = require('electron')

const MESSAGES = require('./messages')

module.exports = (window) => Menu.buildFromTemplate([
  {
    label: app.name,
    submenu: [
      {
        role: 'quit',
      },
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
    role: 'viewMenu',
    submenu: [
      {
        role: 'reload',
      },
      {
        role: 'forceReload',
      },
      {
        role: 'toggleDevTools',
      },
    ],
  },
])
