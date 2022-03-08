import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import { ScriptProcessor, ScriptClass } from '../../processors/script-processor';

const SCRIPT_COMPONENT_NAME = 'script';

export class ScriptProcessorPlugin implements ProcessorPlugin {
  async load(options: ProcessorPluginOptions): Promise<ScriptProcessor> {
    const {
      helpers,
      createGameObjectObserver,
      gameObjectSpawner,
      gameObjectDestroyer,
      store,
      messageBus,
    } = options;
    const { scripts } = await helpers.loadScripts<Record<string, ScriptClass>>();

    return new ScriptProcessor({
      gameObjectObserver: createGameObjectObserver({}),
      scriptsObserver: createGameObjectObserver({
        components: [
          SCRIPT_COMPONENT_NAME,
        ],
      }),
      gameObjectSpawner,
      gameObjectDestroyer,
      store,
      scripts,
      messageBus,
    });
  }
}
