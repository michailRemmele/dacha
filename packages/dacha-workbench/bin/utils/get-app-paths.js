const path = require('path')

const binPaths = {
  darwin: 'Dacha Workbench.app/Contents/MacOS/Dacha Workbench',
  freebsd: 'Dacha Workbench',
  linux: 'Dacha Workbench',
  win32: 'Dacha Workbench.exe',
}

const resourcesPaths = {
  darwin: 'Dacha Workbench.app/Contents/Resources/app',
  freebsd: path.join('resources', 'app'),
  linux: path.join('resources', 'app'),
  win32: path.join('resources', 'app'),
}

const getExecPath = () => {
  const binPath = binPaths[process.platform]

  if (binPath === undefined) {
    throw new Error(`The following platform is unsupported: ${process.platform}`)
  }

  return binPath
}

const getResourcesPath = () => {
  const resourcesPath = resourcesPaths[process.platform]

  if (resourcesPath === undefined) {
    throw new Error(`The following platform is unsupported: ${process.platform}`)
  }

  return resourcesPath
}

module.exports = {
  getExecPath,
  getResourcesPath,
}
