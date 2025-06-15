const path = require('path')
const fs = require('fs')

const mainPackage = require('../../package.json')

const EXCLUDE_DEPS = ['electron', 'electron-packager']
// Some of the dev deps have to be included because application builds extension using webpack
// TODO: Try to move all of these dev dependencies to dependencies section
// to avoid necessity to manually copy them and support this list
const INCLUDE_DEV_DEPS = [
  'ts-loader',
  'clean-webpack-plugin',
  'copy-webpack-plugin',
  'css-loader',
  'style-loader',
  'html-webpack-plugin',
  'webpack',
  'webpack-cli',
  'webpack-dev-middleware',
  'webpack-virtual-modules',
]

const buildPackage = () => {
  const appPackage = {
    name: 'dacha-workbench-app',
    version: mainPackage.version,
    productName: 'Workbench',
    main: 'index.js',
    dependencies: Object.keys(mainPackage.dependencies).reduce((acc, name) => {
      if (!EXCLUDE_DEPS.includes(name)) {
        acc[name] = mainPackage.dependencies[name]
      }
      return acc
    }, {}),
    devDependencies: Object.keys(mainPackage.devDependencies).reduce((acc, name) => {
      if (INCLUDE_DEV_DEPS.includes(name)) {
        acc[name] = mainPackage.devDependencies[name]
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
