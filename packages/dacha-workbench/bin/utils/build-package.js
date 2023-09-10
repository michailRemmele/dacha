const path = require('path')
const fs = require('fs')

const mainPackage = require('../../package.json')

const EXCLUDE_DEPS = ['electron', 'electron-packager']
const INCLUDE_DEV_DEPS = [
  '@babel/cli',
  '@babel/core',
  '@babel/eslint-parser',
  '@babel/preset-react',
  '@babel/preset-typescript',
  'babel-loader',
  'clean-webpack-plugin',
  'copy-webpack-plugin',
  'css-loader',
  'style-loader',
  'html-webpack-plugin',
  'webpack',
  'webpack-cli',
  'webpack-dev-middleware',
]

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
