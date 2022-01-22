import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import Jammer from '../../processors/jammer/jammer';

interface JammerPluginOptions extends ProcessorPluginOptions {
  messages: Array<string>;
}

export class JammerPlugin implements ProcessorPlugin {
  load(options: JammerPluginOptions) {
    const {
      messages,
      messageBus,
    } = options;

    return new Jammer({
      messages,
      messageBus,
    });
  }
}
