import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import ShootingProcessor from 'game/processors/shootingProcessor/shootingProcessor';

class ShootingProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    return new ShootingProcessor({
      gameObjectSpawner: options.gameObjectSpawner,
      gameObjectObserver: options.gameObjectObserver,
    });
  }
}

export default ShootingProcessorPlugin;
