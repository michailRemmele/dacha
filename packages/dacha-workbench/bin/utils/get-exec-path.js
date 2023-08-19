const binPaths = {
  darwin: 'Remiz Editor.app/Contents/MacOS/Remiz Editor',
  freebsd: 'Remiz Editor',
  linux: 'Remiz Editor',
  win32: 'Remiz Editor.exe',
}

const getExecPath = () => {
  const binPath = binPaths[process.platform]

  if (binPath === undefined) {
    throw new Error(`The following platform is unsupported: ${process.platform}`)
  }

  return binPath
}

module.exports = getExecPath
