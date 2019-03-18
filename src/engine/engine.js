import ScopeProvider from './scope/scopeProvider';
import IOC from './ioc/ioc';
import ResolveSingletonStrategy from './ioc/resolveSingletonStrategy';

import ResourceLoader from './resourceLoader/resourceLoader';

import * as global from 'engine/consts/global';

import GameObjectCreator from './gameObject/gameObjectCreator';
import GameLoop from './gameLoop';

import SceneProvider from './scene/sceneProvider';

class Engine {
  constructor(options) {
    const {
      GENERAL_SCOPE_NAME,
      SCENE_PROVIDER_KEY_NAME,
      RESOURCES_LOADER_KEY_NAME,
      GAME_OBJECT_CREATOR_KEY_NAME,
    } = global;

    this.options = options;

    ScopeProvider.createScope(GENERAL_SCOPE_NAME);
    ScopeProvider.setCurrentScope(GENERAL_SCOPE_NAME);

    IOC.register(
      SCENE_PROVIDER_KEY_NAME,
      new ResolveSingletonStrategy(new SceneProvider(this.options.processorsPlugins))
    );
    IOC.register(RESOURCES_LOADER_KEY_NAME, new ResolveSingletonStrategy(new ResourceLoader()));
    IOC.register(
      GAME_OBJECT_CREATOR_KEY_NAME,
      new ResolveSingletonStrategy(new GameObjectCreator(this.options.components))
    );
  }

  async start() {
    const {
      SCENE_PROVIDER_KEY_NAME,
      RESOURCES_LOADER_KEY_NAME,
      GAME_OBJECT_CREATOR_KEY_NAME,
    } = global;

    const resourceLoader = IOC.resolve(RESOURCES_LOADER_KEY_NAME);
    const sceneProvider = IOC.resolve(SCENE_PROVIDER_KEY_NAME);
    const gameObjectCreator = IOC.resolve(GAME_OBJECT_CREATOR_KEY_NAME);

    const mainConfig = await resourceLoader.load(this.options.mainConfig);

    await Promise.all(mainConfig.prefabs.map((prefab) => {
      return resourceLoader.load(prefab.src)
        .then((prefabConfig) => {
          gameObjectCreator.register(prefabConfig);
        });
    }));

    await Promise.all(mainConfig.scenes.map((scene) => {
      return resourceLoader.load(scene.src)
        .then((sceneConfig) => {
          return sceneProvider.createScene(sceneConfig);
        });
    }));
    sceneProvider.setCurrentScene(mainConfig.startScene);

    const gameLoop = new GameLoop();
    gameLoop.run();
  }
}

export default Engine;
