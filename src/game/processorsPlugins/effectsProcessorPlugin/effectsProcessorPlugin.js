import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import EffectsProcessor from 'game/processors/effectsProcessor/effectsProcessor';

class EffectsProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    return new EffectsProcessor({
      gameObjectObserver: options.gameObjectObserver,
    });
  }
}

export default EffectsProcessorPlugin;
