import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import CameraProcessor from 'contrib/processors/cameraProcessor/cameraProcessor';

class CameraProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      initialCamera,
      gameObjectObserver,
      store,
    } = options;

    return new CameraProcessor({
      initialCamera: initialCamera,
      gameObjectObserver: gameObjectObserver,
      store: store,
    });
  }
}

export default CameraProcessorPlugin;
