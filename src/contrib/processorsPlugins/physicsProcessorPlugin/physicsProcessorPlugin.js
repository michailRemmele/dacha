import ProcessorPlugin from '../../../engine/processorPlugin/processorPlugin';
import PhysicsProcessor from '../../processors/physicsProcessor/physicsProcessor';

class PhysicsProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      gravitationalAcceleration,
      gameObjectObserver,
      store,
    } = options;

    return new PhysicsProcessor({
      gravitationalAcceleration,
      gameObjectObserver,
      store,
    });
  }
}

export default PhysicsProcessorPlugin;
