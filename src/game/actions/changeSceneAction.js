import Action from 'core/action/action';
import IOC from 'core/ioc/ioc';

import * as global from 'consts/global';

class ChangeSceneAction extends Action {
  execute(args) {
    let sceneName = args[0];

    const sceneProvider = IOC.resolve(global.SCENE_PROVIDER_KEY_NAME);
    sceneProvider.setCurrentScene(sceneName);
  }
}

export default ChangeSceneAction;
