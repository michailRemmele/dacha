import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import ScriptProcessor from '../../processors/scriptProcessor/scriptProcessor';

const SCRIPT_COMPONENT_NAME = 'script';

export class ScriptProcessorPlugin implements ProcessorPlugin {
  async load(options: ProcessorPluginOptions) {
    const {
      helpers,
      createGameObjectObserver,
      gameObjectSpawner,
      gameObjectDestroyer,
      store,
    } = options;
    const { scripts } = await helpers.loadScripts();

    return new ScriptProcessor({
      gameObjectObserver: createGameObjectObserver({
        components: [
          SCRIPT_COMPONENT_NAME,
        ],
      }),
      gameObjectSpawner,
      gameObjectDestroyer,
      store,
      scripts,
    });
  }
}
