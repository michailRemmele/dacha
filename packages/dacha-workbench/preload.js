const { contextBridge } = require('electron')
const path = require('path')
const fs = require('fs')

const isDev = process.env.NODE_ENV === 'development'

const GAME_CONFIG_PATH = isDev ? 'fixture/config.json' : 'public/resources/config.json'

contextBridge.exposeInMainWorld('electron', {
  getGameConfig: () => {
    const configData = fs.readFileSync(path.resolve(GAME_CONFIG_PATH))

    return JSON.parse(configData)
  },
})
