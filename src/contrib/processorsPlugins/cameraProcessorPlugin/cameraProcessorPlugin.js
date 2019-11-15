import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import CameraProcessor from 'contrib/processors/cameraProcessor/cameraProcessor';

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
      initialCamera: initialCamera,
      window: window,
      gameObjectObserver: gameObjectObserver,
      store: store,
    });
  }
}

export default CameraProcessorPlugin;
