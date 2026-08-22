const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const express = require('express');
const path = require('path');

const getMenu = require('./electron/get-menu');
const getAssetsDialog = require('./electron/get-assets-dialog');
const getPathSelectionDialog = require('./electron/get-path-selection-dialog');
const handleCloseApp = require('./electron/handle-close-app');
const MESSAGES = require('./electron/messages');
const getEditorConfig = require('./electron/get-editor-config');
const applyExtension = require('./electron/apply-extension');
const watchProjectConfig = require('./electron/watch-project-config');
const normalizePath = require('./electron/utils/normilize-path');
const registerClipboardShortcuts = require('./electron/register-clipboard-shortcuts');

const menuActions = require('./electron/menu-actions');

const editorConfig = getEditorConfig();

const isDev = process.env.NODE_ENV === 'development';

const expressApp = express();

if (isDev) {
  const webpack = require('webpack');
  const middleware = require('webpack-dev-middleware');

  const webpackConfig = require('./webpack.config');

  const compiler = webpack(webpackConfig);

  expressApp.use(middleware(compiler));
  expressApp.use(express.static(webpackConfig.devServer.static.directory));
}

if (!isDev) {
  expressApp.use(express.static(path.join(__dirname, 'build')));
}
expressApp.use(express.static(path.resolve(editorConfig.assetsRoot)));

const server = expressApp.listen(0);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    backgroundColor: '#ffffff',
    icon: path.join(__dirname, 'app-icons', 'icon.png'),
    ...(process.platform === 'darwin'
      ? {
          titleBarStyle: 'hidden',
          trafficLightPosition: { x: 16, y: 10 },
        }
      : { frame: false }),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
    },
  });
  win.once('ready-to-show', () => {
    win.show();
  });

  Menu.setApplicationMenu(getMenu(win));

  ipcMain.handle(MESSAGES.ASSETS_DIALOG, (_, ...args) =>
    getAssetsDialog(editorConfig.assetsRoot, ...args),
  );
  ipcMain.handle(MESSAGES.PATH_DIALOG, (_, ...args) =>
    getPathSelectionDialog(normalizePath(editorConfig.contextRoot), ...args),
  );
  ipcMain.on(MESSAGES.SET_UNSAVED_CHANGES, (_, unsavedChanges) => {
    win.off('close', handleCloseApp);
    if (unsavedChanges) {
      win.on('close', handleCloseApp);
    }
  });

  ipcMain.on(MESSAGES.SAVE, () => menuActions.save(win));
  ipcMain.on(MESSAGES.UNDO, () => menuActions.undo(win));
  ipcMain.on(MESSAGES.REDO, () => menuActions.redo(win));
  ipcMain.on(MESSAGES.CUT, () => menuActions.cut(win));
  ipcMain.on(MESSAGES.COPY, () => menuActions.copy(win));
  ipcMain.on(MESSAGES.PASTE, () => menuActions.paste(win));
  ipcMain.on(MESSAGES.DELETE, () => menuActions.deleteSelection(win));
  ipcMain.on(MESSAGES.SETTINGS, (_, type) =>
    menuActions.openSettings(win, type),
  );
  ipcMain.on(MESSAGES.TOGGLE_DEBUG_LAYER, (_, id, enabled) =>
    menuActions.toggleDebugLayer(win, id, enabled),
  );
  ipcMain.on(MESSAGES.SWITCH_THEME, (_, preference) =>
    menuActions.switchTheme(win, preference),
  );
  ipcMain.on(MESSAGES.QUIT_APP, () => menuActions.quit());

  ipcMain.on(MESSAGES.WINDOW_MINIMIZE, () => win.minimize());
  ipcMain.on(MESSAGES.WINDOW_MAXIMIZE_TOGGLE, () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
  ipcMain.on(MESSAGES.WINDOW_CLOSE, () => win.close());

  const sendWindowState = () =>
    win.webContents.send(MESSAGES.WINDOW_STATE_CHANGED, win.isMaximized());
  win.on('maximize', sendWindowState);
  win.on('unmaximize', sendWindowState);
  win.once('ready-to-show', sendWindowState);

  if (process.platform !== 'darwin') {
    registerClipboardShortcuts(win);
  }

  win.loadURL(`http://localhost:${server.address().port}`);

  if (!isDev) {
    applyExtension(expressApp, win);
  }

  watchProjectConfig(editorConfig.projectConfig, win);
};

app.whenReady().then(() => {
  if (isDev && process.platform === 'darwin') {
    app.dock?.setIcon(path.join(__dirname, 'app-icons', 'icon-mac.png'));
  }

  createWindow();
});
