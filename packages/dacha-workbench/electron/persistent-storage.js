const { saveFile, readFile } = require('./file-system')

const EDITOR_CACHE_PATH = '.dacha/cache.json'

const savePersistentStorage = (state) => {
  saveFile(EDITOR_CACHE_PATH, JSON.stringify(state, null, 2))
}

const loadPersistentStorage = () => {
  const cache = readFile(EDITOR_CACHE_PATH)

  return cache ? JSON.parse(cache) : {}
}

module.exports = {
  savePersistentStorage,
  loadPersistentStorage,
}
