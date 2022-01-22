import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import MouseInputProcessor from '../../processors/mouseInputProcessor/mouseInputProcessor';

export class MouseInputProcessorPlugin implements ProcessorPlugin {
  load(options: ProcessorPluginOptions) {
    return new MouseInputProcessor({
      messageBus: options.messageBus,
    });
  }
}
