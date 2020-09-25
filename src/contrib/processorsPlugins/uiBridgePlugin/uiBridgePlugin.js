import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import UiBridge from 'contrib/processors/uiBridge/uiBridge';

class UiBridgePlugin extends ProcessorPlugin {
  async load(options) {
    const {
      helpers,
      sceneController,
      gameObjectObserver,
      gameObjectSpawner,
      gameObjectDestroyer,
      store,
    } = options;
    const { onInit, onDestroy } = await helpers.loadUiApp();

    return new UiBridge({
      onInit,
      onDestroy,
      sceneController,
      gameObjectObserver,
      gameObjectSpawner,
      gameObjectDestroyer,
      store,
    });
  }
}

export default UiBridgePlugin;
