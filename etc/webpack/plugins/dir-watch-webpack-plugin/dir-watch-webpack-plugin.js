const path = require('path');
const { lstatSync, readdirSync } = require('fs');

function isDir(source) {
  return lstatSync(source).isDirectory();
}

function expandDir(dir) {
  const fullDirName = path.resolve(dir);
  return readdirSync(fullDirName).reduce((accumulator, item) => {
    const fullPath = path.join(dir, item);

    if (isDir(fullPath)) {
      accumulator = accumulator.concat(expandDir(fullPath));
    }

    return accumulator;
  }, [ fullDirName ]);
}

class DirWatchWebpackPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.afterCompile.tap('DirWatchWebpackPlugin', (compilation) => {
      expandDir(this.options.path).forEach((dir) => {
        compilation.contextDependencies.add(dir);
      });
    });
  }
}

module.exports = DirWatchWebpackPlugin;
