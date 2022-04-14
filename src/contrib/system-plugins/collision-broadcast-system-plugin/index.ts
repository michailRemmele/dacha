import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { CollisionBroadcastSystem } from '../../systems/collision-broadcast-system';

const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';

export class CollisionBroadcastSystemPlugin implements SystemPlugin {
  load(options: SystemPluginOptions) {
    return new CollisionBroadcastSystem({
      gameObjectObserver: options.createGameObjectObserver({
        components: [
          COLLIDER_CONTAINER_COMPONENT_NAME,
        ],
      }),
      messageBus: options.messageBus,
    });
  }
}
