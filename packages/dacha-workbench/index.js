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
const MESSAGES = require('./electron/messages')

const { assets } = require(path.resolve(process.env.EDITOR_CONFIG))

const UI_PORT = 8080

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
expressApp.use(express.static(path.resolve(assets)))

expressApp.listen(UI_PORT)

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  win.maximize()

  Menu.setApplicationMenu(getMenu(win))

  ipcMain.handle(MESSAGES.ASSETS_DIALOG, () => getAssetsDialog(assets))

  win.loadURL(`http://localhost:${UI_PORT}`)
}

app.whenReady().then(() => {
  createWindow()
})
