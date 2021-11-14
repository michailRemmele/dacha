import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import PhysicsProcessor from '../../processors/physicsProcessor/physicsProcessor';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const TRANSFORM_COMPONENT_NAME = 'transform';

interface PhysicsProcessorPluginOptions extends ProcessorPluginOptions {
  gravitationalAcceleration: number;
}

export class PhysicsProcessorPlugin implements ProcessorPlugin {
  load(options: PhysicsProcessorPluginOptions) {
    const {
      gravitationalAcceleration,
      createGameObjectObserver,
      store,
    } = options;

    return new PhysicsProcessor({
      gravitationalAcceleration,
      gameObjectObserver: createGameObjectObserver({
        components: [
          RIGID_BODY_COMPONENT_NAME,
          TRANSFORM_COMPONENT_NAME,
        ],
      }),
      store,
    });
  }
}
