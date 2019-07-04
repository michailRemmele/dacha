import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import CollisionProcessor from 'contrib/processors/collisionProcessor/collisionProcessor';

class CollisionProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    return new CollisionProcessor({
      gameObjectObserver: options.gameObjectObserver,
    });
  }
}

export default CollisionProcessorPlugin;
