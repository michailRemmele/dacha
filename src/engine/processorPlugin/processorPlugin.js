class ProcessorPlugin {
  async load() {
    throw new Error('You should override this function');
  }
}

export default ProcessorPlugin;
