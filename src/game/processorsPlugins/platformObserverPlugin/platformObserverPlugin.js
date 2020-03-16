import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import PlatformObserver from 'game/processors/platformObserver/platformObserver';

class PlatformObserverPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      gameObjectObserver,
      store,
    } = options;

    return new PlatformObserver({
      gameObjectObserver: gameObjectObserver,
      store: store,
    });
  }
}

export default PlatformObserverPlugin;
