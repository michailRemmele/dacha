import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import AnimateProcessor from 'contrib/processors/animateProcessor/animateProcessor';

class AnimateProcessorPlugin extends ProcessorPlugin {
  async load() {
    return new AnimateProcessor();
  }
}

export default AnimateProcessorPlugin;
