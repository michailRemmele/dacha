import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { PhysicsSystem } from '../../systems/physics-system';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const TRANSFORM_COMPONENT_NAME = 'transform';

interface PhysicsSystemPluginOptions extends SystemPluginOptions {
  gravitationalAcceleration: number;
}

export class PhysicsSystemPlugin implements SystemPlugin {
  load(options: PhysicsSystemPluginOptions) {
    const {
      gravitationalAcceleration,
      createGameObjectObserver,
      store,
      messageBus,
    } = options;

    return new PhysicsSystem({
      gravitationalAcceleration,
      gameObjectObserver: createGameObjectObserver({
        components: [
          RIGID_BODY_COMPONENT_NAME,
          TRANSFORM_COMPONENT_NAME,
        ],
      }),
      store,
      messageBus,
    });
  }
}
