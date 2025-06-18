const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
} = require('electron')
const express = require('express')
const path = require('path')

const getMenu = require('./electron/get-menu')
const getAssetsDialog = require('./electron/get-assets-dialog')
const handleCloseApp = require('./electron/handle-close-app')
const MESSAGES = require('./electron/messages')
const getEditorConfig = require('./electron/utils/get-editor-config')
const applyExtension = require('./electron/apply-extension')
const watchProjectConfig = require('./electron/watch-project-config')

const editorConfig = getEditorConfig()

const isDev = process.env.NODE_ENV === 'development'

const expressApp = express()

if (isDev) {
  const webpack = require('webpack')
  const middleware = require('webpack-dev-middleware')

  const webpackConfig = require('./webpack.config')

  const compiler = webpack(webpackConfig)

  expressApp.use(
    middleware(compiler),
  )
  expressApp.use(express.static(webpackConfig.devServer.static.directory))
}

if (!isDev) {
  expressApp.use(express.static(path.join(__dirname, 'build')))
}
expressApp.use(express.static(path.resolve(editorConfig.assets)))

const server = expressApp.listen(0)

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
    },
  })
  win.once('ready-to-show', () => {
    win.show()
  })

  Menu.setApplicationMenu(getMenu(win))

  ipcMain.handle(
    MESSAGES.ASSETS_DIALOG,
    (_, ...args) => getAssetsDialog(editorConfig.assets, ...args),
  )
  ipcMain.on(MESSAGES.SET_UNSAVED_CHANGES, (_, unsavedChanges) => {
    win.off('close', handleCloseApp)
    if (unsavedChanges) {
      win.on('close', handleCloseApp)
    }
  })

  win.loadURL(`http://localhost:${server.address().port}`)

  if (!isDev) {
    applyExtension(expressApp, win)
  }

  watchProjectConfig(editorConfig.projectConfig, win)
}

app.whenReady().then(() => {
  createWindow()
})
