import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import MovementProcessor from 'contrib/processors/movementProcessor/movementProcessor';

class MovementProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    return new MovementProcessor({
      gameObjectObserver: options.gameObjectObserver,
    });
  }
}

export default MovementProcessorPlugin;
