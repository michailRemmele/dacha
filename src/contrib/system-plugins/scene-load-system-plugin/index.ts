import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { SceneLoadSystem } from '../../systems/scene-load-system';

export class SceneLoadSystemPlugin implements SystemPlugin {
  load(options: SystemPluginOptions) {
    const { sceneController, messageBus } = options;

    return new SceneLoadSystem({
      sceneController,
      messageBus,
    });
  }
}
