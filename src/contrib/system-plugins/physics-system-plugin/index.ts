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
      createEntityObserver,
      store,
      messageBus,
    } = options;

    return new PhysicsSystem({
      gravitationalAcceleration,
      entityObserver: createEntityObserver({
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
