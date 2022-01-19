import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import CollisionBroadcastProcessor
  from '../../processors/collisionBroadcastProcessor/collisionBroadcastProcessor';

const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';

export class CollisionBroadcastProcessorPlugin implements ProcessorPlugin {
  load(options: ProcessorPluginOptions) {
    return new CollisionBroadcastProcessor({
      gameObjectObserver: options.createGameObjectObserver({
        components: [
          COLLIDER_CONTAINER_COMPONENT_NAME,
        ],
      }),
      messageBus: options.messageBus,
    });
  }
}
