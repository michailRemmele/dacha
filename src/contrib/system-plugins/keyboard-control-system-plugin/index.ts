import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { KeyboardControlSystem } from '../../systems/keyboard-control-system';

const CONTROL_COMPONENT_NAME = 'keyboardControl';

export class KeyboardControlSystemPlugin implements SystemPlugin {
  load(options: SystemPluginOptions) {
    return new KeyboardControlSystem({
      entityObserver: options.createEntityObserver({
        components: [
          CONTROL_COMPONENT_NAME,
        ],
      }),
      messageBus: options.messageBus,
    });
  }
}
