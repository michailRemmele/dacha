import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import InputProcessor from 'contrib/processors/inputProcessor/inputProcessor';

class InputProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    return new InputProcessor(options.keyBindings);
  }
}

export default InputProcessorPlugin;
