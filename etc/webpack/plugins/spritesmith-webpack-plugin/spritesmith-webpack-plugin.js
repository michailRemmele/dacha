/**
 * Webpack SpriteSmith plugin based on spritesmith
 * @see https://github.com/twolfson/spritesmith
 */
const glob = require('glob');
const path = require('path');
const spritesmith = require('spritesmith');

class SpriteSmithWebpackPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('SpriteSmithWebpackPlugin', (compilation, callback) => {
      const { input, output, padding } = this.options;

      const globPattern = `${input.path}/${input.pattern}`;
      const params = {
        src: glob.sync(globPattern),
        padding: padding || 0,
      };
      spritesmith.run(params, (err, result) => {
        const assets = [
          {
            name: output.spriteFilename,
            source: () => {
              return result.image;
            },
          },
          {
            name: output.sourceMapFilename,
            source: () => {
              const source = Object.keys(result.coordinates).reduce((source, itemKey) => {
                const parentDir = path.dirname(itemKey).split(path.sep).pop();
                const filenameWithoutExt = path.basename(itemKey, path.extname(itemKey));
                const newKey = `${parentDir}${path.sep}${filenameWithoutExt}`;
                source[newKey] = result.coordinates[itemKey];
                return source;
              }, {});
              return JSON.stringify(source);
            },
          },
        ];

        assets.forEach((asset) => {
          const assetSource = asset.source();
          compilation.assets[asset.name] = {
            source: function() {
              return assetSource;
            },
            size: function() {
              return assetSource.length;
            },
          };
        });

        callback();
      });
    });
  }
}

module.exports = SpriteSmithWebpackPlugin;
