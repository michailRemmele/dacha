import ProcessorPlugin from '../../../engine/processorPlugin/processorPlugin';
import MouseInputCoordinatesProjector
  from '../../processors/mouseInputCoordinatesProjector/mouseInputCoordinatesProjector';

class MouseInputCoordinatesProjectorPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      store,
    } = options;

    return new MouseInputCoordinatesProjector({
      store,
    });
  }
}

export default MouseInputCoordinatesProjectorPlugin;
