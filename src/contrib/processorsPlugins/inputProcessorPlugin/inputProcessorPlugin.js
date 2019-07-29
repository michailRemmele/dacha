import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import InputProcessor from 'contrib/processors/inputProcessor/inputProcessor';

class InputProcessorPlugin extends ProcessorPlugin {
  async load() {
    return new InputProcessor();
  }
}

export default InputProcessorPlugin;
