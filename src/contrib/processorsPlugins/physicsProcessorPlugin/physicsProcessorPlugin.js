import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import PhysicsProcessor from 'contrib/processors/physicsProcessor/physicsProcessor';

class PhysicsProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      gravitationalAcceleration,
      gameObjectObserver,
    } = options;

    return new PhysicsProcessor({
      gravitationalAcceleration: gravitationalAcceleration,
      gameObjectObserver: gameObjectObserver,
    });
  }
}

export default PhysicsProcessorPlugin;
