import { ProcessorPlugin } from '../../../engine/processor';
import MouseInputProcessor from '../../processors/mouseInputProcessor/mouseInputProcessor';

export class MouseInputProcessorPlugin implements ProcessorPlugin {
  load() {
    return new MouseInputProcessor();
  }
}
