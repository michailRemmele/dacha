import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import KeyboardInputProcessor
  from '../../processors/keyboardInputProcessor/keyboardInputProcessor';

export class KeyboardInputProcessorPlugin implements ProcessorPlugin {
  load(options: ProcessorPluginOptions) {
    return new KeyboardInputProcessor({
      messageBus: options.messageBus,
    });
  }
}
