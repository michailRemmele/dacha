const path = require('path')

const normalizePath = (inputPath) => {
  if (!inputPath || path.isAbsolute(inputPath)) {
    return inputPath
  }

  return path.resolve(process.env.ORIGINAL_CWD, inputPath)
}

module.exports = normalizePath
