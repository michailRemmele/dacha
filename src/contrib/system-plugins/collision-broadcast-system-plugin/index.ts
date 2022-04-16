import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { CollisionBroadcastSystem } from '../../systems/collision-broadcast-system';

const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';

export class CollisionBroadcastSystemPlugin implements SystemPlugin {
  load(options: SystemPluginOptions) {
    return new CollisionBroadcastSystem({
      entityObserver: options.createEntityObserver({
        components: [
          COLLIDER_CONTAINER_COMPONENT_NAME,
        ],
      }),
      messageBus: options.messageBus,
    });
  }
}
