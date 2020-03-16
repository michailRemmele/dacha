import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import EnemiesDetector from 'game/processors/enemiesDetector/enemiesDetector';

class EnemiesDetectorPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      gameObjectObserver,
      store,
    } = options;

    return new EnemiesDetector({
      gameObjectObserver: gameObjectObserver,
      store: store,
    });
  }
}

export default EnemiesDetectorPlugin;
