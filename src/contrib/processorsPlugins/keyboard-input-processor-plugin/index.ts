import { ProcessorPlugin } from '../../../engine/processor';
import KeyboardInputProcessor
  from '../../processors/keyboardInputProcessor/keyboardInputProcessor';

export class KeyboardInputProcessorPlugin implements ProcessorPlugin {
  load() {
    return new KeyboardInputProcessor();
  }
}
