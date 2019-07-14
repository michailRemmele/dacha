import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import PhysicsProcessor from 'contrib/processors/physicsProcessor/physicsProcessor';

class PhysicsProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      gravitationalAcceleration,
    } = options;

    return new PhysicsProcessor({
      gravitationalAcceleration: gravitationalAcceleration,
      scene: options.scene,
      gameObjectObserver: options.gameObjectObserver,
    });
  }
}

export default PhysicsProcessorPlugin;
