import ProcessorPlugin from '../../../engine/processorPlugin/processorPlugin';
import CameraProcessor from '../../processors/cameraProcessor/cameraProcessor';

class CameraProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      initialCamera,
      windowNodeId,
      gameObjectObserver,
      store,
    } = options;

    const window = document.getElementById(windowNodeId);

    return new CameraProcessor({
      initialCamera,
      window,
      gameObjectObserver,
      store,
    });
  }
}

export default CameraProcessorPlugin;
