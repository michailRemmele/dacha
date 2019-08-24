import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import MouseControlProcessor from 'contrib/processors/mouseControlProcessor/mouseControlProcessor';

class MouseControlProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    return new MouseControlProcessor({
      gameObjectObserver: options.gameObjectObserver,
    });
  }
}

export default MouseControlProcessorPlugin;
