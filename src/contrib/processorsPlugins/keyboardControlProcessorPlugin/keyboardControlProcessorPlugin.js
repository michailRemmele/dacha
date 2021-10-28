import ProcessorPlugin from '../../../engine/processorPlugin/processorPlugin';
import KeyboardControlProcessor
  from '../../processors/keyboardControlProcessor/keyboardControlProcessor';

class KeyboardControlProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    return new KeyboardControlProcessor({
      gameObjectObserver: options.gameObjectObserver,
    });
  }
}

export default KeyboardControlProcessorPlugin;
