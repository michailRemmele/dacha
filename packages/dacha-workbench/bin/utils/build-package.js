const path = require('path')
const fs = require('fs')

const mainPackage = require('../../package.json')

const EXCLUDE_DEPS = ['electron', 'electron-packager']

const buildPackage = () => {
  const appPackage = {
    name: 'remiz-editor-app',
    version: mainPackage.version,
    productName: 'Remiz Editor',
    main: 'index.js',
    dependencies: Object.keys(mainPackage.dependencies).reduce((acc, name) => {
      if (!EXCLUDE_DEPS.includes(name)) {
        acc[name] = mainPackage.dependencies[name]
      }
      return acc
    }, {}),
  }

  fs.writeFileSync(
    path.resolve('app', 'package.json'),
    JSON.stringify(appPackage, null, 2),
  )
}

module.exports = buildPackage
