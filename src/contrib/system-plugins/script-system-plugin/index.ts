import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { ScriptSystem, ScriptClass } from '../../systems/script-system';

const SCRIPT_COMPONENT_NAME = 'script';

export class ScriptSystemPlugin implements SystemPlugin {
  async load(options: SystemPluginOptions): Promise<ScriptSystem> {
    const {
      helpers,
      createGameObjectObserver,
      gameObjectSpawner,
      gameObjectDestroyer,
      store,
      messageBus,
    } = options;
    const { scripts } = await helpers.loadScripts<Record<string, ScriptClass>>();

    return new ScriptSystem({
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
