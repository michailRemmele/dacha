import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import UiBridge from '../../processors/uiBridge/uiBridge';

interface UiBridgePluginOptions extends ProcessorPluginOptions {
  filterComponents: Array<string>;
}

export class UiBridgePlugin implements ProcessorPlugin {
  async load(options: UiBridgePluginOptions) {
    const {
      helpers,
      sceneController,
      createGameObjectObserver,
      gameObjectSpawner,
      gameObjectDestroyer,
      store,
      filterComponents,
    } = options;
    const { onInit, onDestroy } = await helpers.loadUiApp();

    return new UiBridge({
      onInit,
      onDestroy,
      sceneController,
      gameObjectObserver: createGameObjectObserver({
        components: filterComponents,
      }),
      gameObjectSpawner,
      gameObjectDestroyer,
      store,
    });
  }
}
