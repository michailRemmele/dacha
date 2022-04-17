import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { Jammer } from '../../systems/jammer';

interface JammerPluginOptions extends SystemPluginOptions {
  messages: Array<string>;
}

export class JammerPlugin implements SystemPlugin {
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
