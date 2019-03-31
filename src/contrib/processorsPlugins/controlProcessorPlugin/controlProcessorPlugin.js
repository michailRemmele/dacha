import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import ControlProcessor from 'contrib/processors/controlProcessor/controlProcessor';

class ControlProcessorPlugin extends ProcessorPlugin {
  async load() {
    return new ControlProcessor();
  }
}

export default ControlProcessorPlugin;
