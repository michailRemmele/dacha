import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import ControlProcessor from 'contrib/processors/controlProcessor/controlProcessor';

class ControlProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    return new ControlProcessor({
      gameObjectObserver: options.gameObjectObserver,
    });
  }
}

export default ControlProcessorPlugin;
