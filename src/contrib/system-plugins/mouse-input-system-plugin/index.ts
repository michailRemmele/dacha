import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { MouseInputSystem } from '../../systems/mouse-input-system';

export class MouseInputSystemPlugin implements SystemPlugin {
  load(options: SystemPluginOptions) {
    return new MouseInputSystem({
      messageBus: options.messageBus,
    });
  }
}
