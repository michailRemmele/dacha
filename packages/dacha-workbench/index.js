const { app, BrowserWindow } = require('electron')
const express = require('express')
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const path = require('path')

const getConfig = require('./webpack.config')

const { components, systems, assets } = require(path.resolve(process.env.EDITOR_CONFIG))

const UI_PORT = 8080

const compiler = webpack(getConfig({
  componentsPath: components,
  systemsPath: systems,
}))

const expressApp = express()

expressApp.use(
  middleware(compiler),
)

expressApp.use(express.static(path.resolve(assets)))

expressApp.listen(UI_PORT)

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  win.maximize()

  win.loadURL(`http://localhost:${UI_PORT}`)
}

app.whenReady().then(() => {
  createWindow()
})
