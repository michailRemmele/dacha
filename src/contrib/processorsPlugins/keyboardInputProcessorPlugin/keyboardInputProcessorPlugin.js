import ProcessorPlugin from '../../../engine/processorPlugin/processorPlugin';
import KeyboardInputProcessor
  from '../../processors/keyboardInputProcessor/keyboardInputProcessor';

class KeyboardInputProcessorPlugin extends ProcessorPlugin {
  async load() {
    return new KeyboardInputProcessor();
  }
}

export default KeyboardInputProcessorPlugin;
