import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import PlatformSizeMeter from 'game/processors/platformSizeMeter/platformSizeMeter';

class PlatformSizeMeterPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      gameObjectObserver,
      store,
    } = options;

    return new PlatformSizeMeter({
      gameObjectObserver: gameObjectObserver,
      store: store,
    });
  }
}

export default PlatformSizeMeterPlugin;
