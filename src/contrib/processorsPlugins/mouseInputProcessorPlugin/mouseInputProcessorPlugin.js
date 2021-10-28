import ProcessorPlugin from '../../../engine/processorPlugin/processorPlugin';
import MouseInputProcessor from '../../processors/mouseInputProcessor/mouseInputProcessor';

class MouseInputProcessorPlugin extends ProcessorPlugin {
  async load() {
    return new MouseInputProcessor();
  }
}

export default MouseInputProcessorPlugin;
