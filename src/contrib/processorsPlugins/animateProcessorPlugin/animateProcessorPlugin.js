import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import AnimateProcessor from 'contrib/processors/animateProcessor/animateProcessor';

class AnimateProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    return new AnimateProcessor({
      scene: options.scene,
    });
  }
}

export default AnimateProcessorPlugin;
