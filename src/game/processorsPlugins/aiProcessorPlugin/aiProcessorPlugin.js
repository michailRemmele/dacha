import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import AIProcessor from 'game/processors/aiProcessor/aiProcessor';

class AIProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      gameObjectObserver,
      store,
    } = options;

    return new AIProcessor({
      gameObjectObserver: gameObjectObserver,
      store: store,
    });
  }
}

export default AIProcessorPlugin;
