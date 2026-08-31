const path = require('path');
const fs = require('fs');

const mainPackage = require('../../package.json');

const APP_DEPS = [
  'express',
  'webpack',
  'webpack-dev-middleware',
  'webpack-virtual-modules',
  'ts-loader',
  'typescript',
  'css-loader',
  'style-loader',
];

const findVersion = (name) => {
  const version =
    mainPackage.dependencies[name] ?? mainPackage.devDependencies[name];

  if (version === undefined) {
    throw new Error(
      `Cannot build the editor app package: "${name}" is required by the app but is not declared in the dependencies of dacha-workbench`,
    );
  }

  return version;
};

const buildPackage = () => {
  const appPackage = {
    name: 'dacha-workbench-app',
    version: mainPackage.version,
    productName: 'Workbench',
    main: 'index.js',
    dependencies: APP_DEPS.reduce((acc, name) => {
      acc[name] = findVersion(name);
      return acc;
    }, {}),
  };

  fs.writeFileSync(
    path.resolve('app', 'package.json'),
    JSON.stringify(appPackage, null, 2),
  );
};

module.exports = buildPackage;
