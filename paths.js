'use strict';

const path = require('path');

module.exports = {
  build: path.join(__dirname, 'build'),
  indexTs: path.join(__dirname, 'src/index.ts'),
  src: path.join(__dirname, 'src'),
  nodeModules: path.join(__dirname, 'node_modules'),
};
