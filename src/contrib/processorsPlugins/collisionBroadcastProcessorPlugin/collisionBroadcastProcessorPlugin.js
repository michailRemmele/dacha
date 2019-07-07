import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import CollisionBroadcastProcessor
  from 'contrib/processors/collisionBroadcastProcessor/collisionBroadcastProcessor';

class CollisionBroadcastProcessorPlugin extends ProcessorPlugin {
  async load() {
    return new CollisionBroadcastProcessor();
  }
}

export default CollisionBroadcastProcessorPlugin;
