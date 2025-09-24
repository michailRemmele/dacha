#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const os = require('os')
const { execSync } = require('child_process')
const packager = require('@electron/packager')

// const getAppIconPath = require('./utils/get-app-icon-path')
const buildPackage = require('./utils/build-package')

// Exit because we don't need to install editor during editor development process
if (fs.existsSync('src')) {
  process.exit(0)
}

const packageOptions = {
  dir: 'app',
  out: 'tmp',
  platform: os.platform(),
  arch: os.arch(),
  overwrite: true,
  prune: false,
  // TODO: Add and configure editor icon set
  // icon: getAppIconPath(),
}

const appFiles = [
  'build',
  'electron',
  'preload.js',
  'index.js',
  'webpack.config.js',
  'webpack.extension.config.js',
]

// Copy resources
appFiles.forEach((file) => {
  fs.cpSync(file, path.resolve('app', file), {
    force: true,
    recursive: true,
  })
})

// Install application dependencies
buildPackage()
execSync('npm install', { cwd: path.resolve('app') })

// Package application
packager(packageOptions)
  .then((packagePaths) => {
    const packagePath = packagePaths[0]

    // Remove temporary directories
    fs.renameSync(packagePath, 'build-app')
    fs.rmSync('tmp', {
      recursive: true,
      force: true,
    })

    fs.rmSync(path.resolve('app'), {
      force: true,
      recursive: true,
    })
  })
