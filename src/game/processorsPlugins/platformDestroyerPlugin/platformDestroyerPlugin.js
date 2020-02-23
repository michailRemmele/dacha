import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import PlatformDestroyer from 'game/processors/platformDestroyer/platformDestroyer';

class PlatformDestroyerPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      gameObjectObserver,
      store,
    } = options;

    return new PlatformDestroyer({
      gameObjectObserver,
      store,
    });
  }
}

export default PlatformDestroyerPlugin;
