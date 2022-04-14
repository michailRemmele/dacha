import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { KeyboardInputSystem } from '../../systems/keyboard-input-system';

export class KeyboardInputSystemPlugin implements SystemPlugin {
  load(options: SystemPluginOptions) {
    return new KeyboardInputSystem({
      messageBus: options.messageBus,
    });
  }
}
