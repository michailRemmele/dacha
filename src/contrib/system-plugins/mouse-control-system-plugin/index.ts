import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { MouseControlSystem } from '../../systems/mouse-control-system';

const CONTROL_COMPONENT_NAME = 'mouseControl';

export class MouseControlSystemPlugin implements SystemPlugin {
  load(options: SystemPluginOptions) {
    return new MouseControlSystem({
      entityObserver: options.createEntityObserver({
        components: [
          CONTROL_COMPONENT_NAME,
        ],
      }),
      messageBus: options.messageBus,
    });
  }
}
