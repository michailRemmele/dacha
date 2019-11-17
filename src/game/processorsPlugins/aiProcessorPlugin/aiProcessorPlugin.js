import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import AIProcessor from 'game/processors/aiProcessor/aiProcessor';

class AIProcessorPlugin extends ProcessorPlugin {
  async load() {
    return new AIProcessor();
  }
}

export default AIProcessorPlugin;
