import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import {
  MouseInputCoordinatesProjector,
} from '../../systems/mouse-input-coordinates-projector';

export class MouseInputCoordinatesProjectorPlugin implements SystemPlugin {
  load(options: SystemPluginOptions) {
    const {
      store,
      messageBus,
    } = options;

    return new MouseInputCoordinatesProjector({
      store,
      messageBus,
    });
  }
}
