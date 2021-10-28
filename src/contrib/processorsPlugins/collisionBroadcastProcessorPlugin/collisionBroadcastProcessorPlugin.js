import ProcessorPlugin from '../../../engine/processorPlugin/processorPlugin';
import CollisionBroadcastProcessor
  from '../../processors/collisionBroadcastProcessor/collisionBroadcastProcessor';

class CollisionBroadcastProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    return new CollisionBroadcastProcessor({
      gameObjectObserver: options.gameObjectObserver,
    });
  }
}

export default CollisionBroadcastProcessorPlugin;
