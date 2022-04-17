import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { CollisionDetectionSystem } from '../../systems/collision-detection-system';

const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';
const TRANSFORM_COMPONENT_NAME = 'transform';

export class CollisionDetectionSystemPlugin implements SystemPlugin {
  load(options: SystemPluginOptions) {
    return new CollisionDetectionSystem({
      entityObserver: options.createEntityObserver({
        components: [
          COLLIDER_CONTAINER_COMPONENT_NAME,
          TRANSFORM_COMPONENT_NAME,
        ],
      }),
      messageBus: options.messageBus,
    });
  }
}
