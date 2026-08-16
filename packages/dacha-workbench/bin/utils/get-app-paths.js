const binPaths = {
  darwin: 'Workbench.app/Contents/MacOS/Workbench',
  freebsd: 'Workbench',
  linux: 'Workbench',
  win32: 'Workbench.exe',
};

const getExecPath = () => {
  const binPath = binPaths[process.platform];

  if (binPath === undefined) {
    throw new Error(
      `The following platform is unsupported: ${process.platform}`,
    );
  }

  return binPath;
};

module.exports = {
  getExecPath,
};
