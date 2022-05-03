const { app, BrowserWindow } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  win.maximize()

  if (isDev) {
    win.loadURL('http://localhost:8080')
  } else {
    win.loadFile(path.join(__dirname, 'build/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
})
