import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import PhysicsProcessor from 'contrib/processors/physicsProcessor/physicsProcessor';

class PhysicsProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    return new PhysicsProcessor({
      scene: options.scene,
    });
  }
}

export default PhysicsProcessorPlugin;
