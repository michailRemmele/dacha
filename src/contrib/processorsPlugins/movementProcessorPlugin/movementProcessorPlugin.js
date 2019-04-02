import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import MovementProcessor from 'contrib/processors/movementProcessor/movementProcessor';

class MovementProcessorPlugin extends ProcessorPlugin {
  async load() {
    return new MovementProcessor();
  }
}

export default MovementProcessorPlugin;
