import ScopeProvider from './scope/scopeProvider';
import IOC from './ioc/ioc';
import ResolveSingletonStrategy from './ioc/resolveSingletonStrategy';

import SceneProvider from './scene/sceneProvider';
import ResourceLoader from './resourceLoader/resourceLoader';
import GameObjectCreator from './gameObject/gameObjectCreator';
import PrefabCollection from './prefab/prefabCollection';
import GameLoop from './gameLoop';

import * as global from 'engine/consts/global';

class Engine {
  constructor(options) {
    const {
      GENERAL_SCOPE_NAME,
      SCENE_PROVIDER_KEY_NAME,
      RESOURCES_LOADER_KEY_NAME,
      GAME_OBJECT_CREATOR_KEY_NAME,
      PREFAB_COLLECTION_KEY_NAME,
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
      PREFAB_COLLECTION_KEY_NAME,
      new ResolveSingletonStrategy(new PrefabCollection(this.options.components))
    );
    IOC.register(
      GAME_OBJECT_CREATOR_KEY_NAME,
      new ResolveSingletonStrategy(new GameObjectCreator(this.options.components))
    );
  }

  async start() {
    const {
      SCENE_PROVIDER_KEY_NAME,
      RESOURCES_LOADER_KEY_NAME,
      PREFAB_COLLECTION_KEY_NAME,
      PROJECT_SETTINGS_KEY_NAME,
    } = global;

    const resourceLoader = IOC.resolve(RESOURCES_LOADER_KEY_NAME);
    const sceneProvider = IOC.resolve(SCENE_PROVIDER_KEY_NAME);
    const prefabCollection = IOC.resolve(PREFAB_COLLECTION_KEY_NAME);

    const mainConfig = await resourceLoader.load(this.options.mainConfig);

    IOC.register(
      PROJECT_SETTINGS_KEY_NAME,
      new ResolveSingletonStrategy(mainConfig.projectSettings)
    );

    await Promise.all(mainConfig.prefabs.map((prefab) => {
      return resourceLoader.load(prefab.src)
        .then((prefabConfig) => {
          prefabCollection.register(prefabConfig);
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

    window.onblur = () => gameLoop.stop();
    window.onfocus = () => gameLoop.run();
  }
}

export default Engine;
