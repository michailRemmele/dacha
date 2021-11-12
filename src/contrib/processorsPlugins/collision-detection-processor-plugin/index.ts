import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import CollisionDetectionProcessor
  from '../../processors/collisionDetectionProcessor/collisionDetectionProcessor';

const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';
const TRANSFORM_COMPONENT_NAME = 'transform';

export class CollisionDetectionProcessorPlugin implements ProcessorPlugin {
  load(options: ProcessorPluginOptions) {
    return new CollisionDetectionProcessor({
      gameObjectObserver: options.createGameObjectObserver({
        components: [
          COLLIDER_CONTAINER_COMPONENT_NAME,
          TRANSFORM_COMPONENT_NAME,
        ],
      }),
    });
  }
}
