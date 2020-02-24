import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import PlatformDestroyer from 'game/processors/platformDestroyer/platformDestroyer';

class PlatformDestroyerPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      store,
    } = options;

    return new PlatformDestroyer({
      store,
    });
  }
}

export default PlatformDestroyerPlugin;
