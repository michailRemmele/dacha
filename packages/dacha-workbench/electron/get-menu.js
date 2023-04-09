const {
  app,
  Menu,
} = require('electron')

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
        click: () => window.webContents.send('SAVE', 1),
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
