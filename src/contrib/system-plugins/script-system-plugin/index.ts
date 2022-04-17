import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { ScriptSystem, ScriptClass } from '../../systems/script-system';

const SCRIPT_COMPONENT_NAME = 'script';

export class ScriptSystemPlugin implements SystemPlugin {
  async load(options: SystemPluginOptions): Promise<ScriptSystem> {
    const {
      helpers,
      createEntityObserver,
      entitySpawner,
      entityDestroyer,
      store,
      messageBus,
    } = options;
    const { scripts } = await helpers.loadScripts<Record<string, ScriptClass>>();

    return new ScriptSystem({
      entityObserver: createEntityObserver({}),
      scriptsObserver: createEntityObserver({
        components: [
          SCRIPT_COMPONENT_NAME,
        ],
      }),
      entitySpawner,
      entityDestroyer,
      store,
      scripts,
      messageBus,
    });
  }
}
