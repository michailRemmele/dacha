const path = require('path');

const ICON_EXTENSION_BY_PLATFORM = {
  darwin: 'icns',
  win32: 'ico',
};

const getAppIconPath = (platform) => {
  const extension = ICON_EXTENSION_BY_PLATFORM[platform];

  if (!extension) {
    return undefined;
  }

  return path.resolve(__dirname, '..', '..', 'app-icons', `icon.${extension}`);
};

module.exports = getAppIconPath;
