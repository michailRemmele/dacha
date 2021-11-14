import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import MouseInputCoordinatesProjector
  from '../../processors/mouseInputCoordinatesProjector/mouseInputCoordinatesProjector';

export class MouseInputCoordinatesProjectorPlugin implements ProcessorPlugin {
  load(options: ProcessorPluginOptions) {
    const {
      store,
    } = options;

    return new MouseInputCoordinatesProjector({
      store,
    });
  }
}
