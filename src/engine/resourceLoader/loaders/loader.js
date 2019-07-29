class Loader {
  getSupportedExtensions() {
    throw new Error('You should override this function');
  }

  load() {
    Promise.reject(new Error('You should override this function'));
  }
}

export default Loader;
