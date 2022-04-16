import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { UiBridge } from '../../systems/ui-bridge';

interface UiBridgePluginOptions extends SystemPluginOptions {
  filterComponents: Array<string>;
}

export class UiBridgePlugin implements SystemPlugin {
  async load(options: UiBridgePluginOptions) {
    const {
      helpers,
      sceneController,
      createEntityObserver,
      entitySpawner,
      entityDestroyer,
      store,
      filterComponents,
      messageBus,
    } = options;
    const { onInit, onDestroy } = await helpers.loadUiApp();

    return new UiBridge({
      onInit,
      onDestroy,
      sceneController,
      entityObserver: createEntityObserver({
        components: filterComponents,
      }),
      entitySpawner,
      entityDestroyer,
      store,
      messageBus,
    });
  }
}
