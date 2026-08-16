#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

// const getAppIconPath = require('./utils/get-app-icon-path')
const buildPackage = require('./utils/build-package');

// Exit because we don't need to install editor during editor development process
if (fs.existsSync('src')) {
  process.exit(0);
}

// Allow skipping the (slow) electron packaging when only the library part is
// being tested in a consumer project
if (process.env.DACHA_SKIP_APP_BUILD) {
  console.warn(
    'DACHA_SKIP_APP_BUILD is set: skipping electron packaging, the editor app will not be available',
  );
  process.exit(0);
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
};

const appFiles = [
  'build',
  'electron',
  'preload.js',
  'index.js',
  'webpack.base.js',
  'webpack.extension.config.js',
];

// Copy resources
appFiles.forEach((file) => {
  fs.cpSync(file, path.resolve('app', file), {
    force: true,
    recursive: true,
  });
});

// Install application dependencies
buildPackage();
execSync('npm install', { cwd: path.resolve('app') });

// Package application
const packageApp = async () => {
  const { packager } = await import('@electron/packager');
  const packagePaths = await packager(packageOptions);
  const packagePath = packagePaths[0];

  // Remove temporary directories
  fs.renameSync(packagePath, 'build-app');
  fs.rmSync('tmp', {
    recursive: true,
    force: true,
  });

  fs.rmSync(path.resolve('app'), {
    force: true,
    recursive: true,
  });
};

packageApp().catch((error) => {
  console.error(error);
  process.exit(1);
});
