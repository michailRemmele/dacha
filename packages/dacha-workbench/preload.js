const { contextBridge } = require('electron')
const path = require('path')

contextBridge.exposeInMainWorld('electron', {
  getProjectInfo: () => path.resolve('./'),
})
