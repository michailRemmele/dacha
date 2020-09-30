'use strict';

const path = require('path');

module.exports = {
  build: path.join(__dirname, 'build'),
  indexJs: path.join(__dirname, 'src/index.js'),
  src: path.join(__dirname, 'src'),
  nodeModules: path.join(__dirname, 'node_modules'),
};
