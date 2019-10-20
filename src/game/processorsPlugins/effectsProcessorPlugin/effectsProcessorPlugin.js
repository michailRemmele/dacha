import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import EffectsProcessor from 'game/processors/effectsProcessor/effectsProcessor';

class EffectsProcessorPlugin extends ProcessorPlugin {
  async load() {
    return new EffectsProcessor();
  }
}

export default EffectsProcessorPlugin;
