import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import PhysicsProcessor from 'contrib/processors/physicsProcessor/physicsProcessor';

class PhysicsProcessorPlugin extends ProcessorPlugin {
  async load() {
    return new PhysicsProcessor();
  }
}

export default PhysicsProcessorPlugin;
