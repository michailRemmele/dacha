/**
 * Webpack SpriteSmith plugin based on spritesmith
 * @see https://github.com/twolfson/spritesmith
 */
const glob = require('glob');
const path = require('path');
const { lstatSync, readdirSync } = require('fs');
const spritesmith = require('spritesmith');

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

class SpriteSmithWebpackPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.afterCompile.tap('SpriteSmithWebpackPlugin', (compilation) => {
      const { input } = this.options;

      console.log(compilation.contextDependencies);
      expandDir(input.path).forEach((dir) => {
        compilation.contextDependencies.add(dir);
      });
    });

    compiler.hooks.emit.tapAsync('SpriteSmithWebpackPlugin', (compilation, callback) => {
      const { input, output } = this.options;

      const globPattern = `${input.path}/${input.pattern}`;
      spritesmith.run({ src: glob.sync(globPattern) }, (err, result) => {
        compilation.assets[output.filename] = {
          source: function() {
            return result.image;
          },
          size: function() {
            return result.image.length;
          },
        };

        callback();
      });
    });
  }
}

module.exports = SpriteSmithWebpackPlugin;
