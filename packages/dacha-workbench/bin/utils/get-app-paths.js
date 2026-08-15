const path = require('path')

const binPaths = {
  darwin: 'Workbench.app/Contents/MacOS/Workbench',
  freebsd: 'Workbench',
  linux: 'Workbench',
  win32: 'Workbench.exe',
}

const resourcesPaths = {
  darwin: 'Workbench.app/Contents/Resources/app',
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
