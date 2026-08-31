const { app, Menu } = require('electron');

const menuActions = require('./menu-actions');

module.exports = (window) =>
  Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [{ role: 'quit' }],
    },
    {
      role: 'fileMenu',
      submenu: [
        {
          label: 'Save',
          accelerator: process.platform === 'darwin' ? 'Cmd+S' : 'Ctrl+S',
          click: () => menuActions.save(window),
        },
      ],
    },
    {
      role: 'editMenu',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          click: () => menuActions.undo(window),
        },
        {
          label: 'Redo',
          accelerator: 'CmdOrCtrl+Shift+Z',
          click: () => menuActions.redo(window),
        },

        { type: 'separator' },

        {
          label: 'Cut',
          accelerator: process.platform === 'darwin' ? 'Cmd+X' : undefined,
          click: () => menuActions.cut(window),
        },
        {
          label: 'Copy',
          accelerator: process.platform === 'darwin' ? 'Cmd+C' : undefined,
          click: () => menuActions.copy(window),
        },
        {
          label: 'Paste',
          accelerator: process.platform === 'darwin' ? 'Cmd+V' : undefined,
          click: () => menuActions.paste(window),
        },
        {
          label: 'Delete',
          accelerator:
            process.platform === 'darwin' ? 'Cmd+Backspace' : 'Delete',
          click: () => menuActions.deleteSelection(window),
        },
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

        {
          label: 'Settings',
          click: () => menuActions.openSettings(window, 'grid'),
        },

        { type: 'separator' },

        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },

        { type: 'separator' },

        { role: 'togglefullscreen' },
      ],
    },
  ]);
