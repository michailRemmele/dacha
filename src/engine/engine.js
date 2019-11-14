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
    } = global;

    this.options = options;

    ScopeProvider.createScope(GENERAL_SCOPE_NAME);
    ScopeProvider.setCurrentScope(GENERAL_SCOPE_NAME);
  }

  async start() {
    const {
      SCENE_PROVIDER_KEY_NAME,
      RESOURCES_LOADER_KEY_NAME,
      PREFAB_COLLECTION_KEY_NAME,
      PROJECT_SETTINGS_KEY_NAME,
      GAME_OBJECT_CREATOR_KEY_NAME,
    } = global;

    const { mainConfig, processorsPlugins, components } = this.options;
    const { projectSettings } = mainConfig;

    IOC.register(PROJECT_SETTINGS_KEY_NAME, new ResolveSingletonStrategy(projectSettings));

    const resourceLoader = new ResourceLoader();
    IOC.register(RESOURCES_LOADER_KEY_NAME, new ResolveSingletonStrategy(resourceLoader));

    const prefabCollection = new PrefabCollection(components);
    IOC.register(PREFAB_COLLECTION_KEY_NAME, new ResolveSingletonStrategy(prefabCollection));

    const gameObjectCreator = new GameObjectCreator(components);
    IOC.register(GAME_OBJECT_CREATOR_KEY_NAME, new ResolveSingletonStrategy(gameObjectCreator));

    const sceneProvider = new SceneProvider(mainConfig.scenes, processorsPlugins);
    IOC.register(SCENE_PROVIDER_KEY_NAME, new ResolveSingletonStrategy(sceneProvider));

    await Promise.all(mainConfig.prefabs.map((prefab) => {
      return resourceLoader.load(prefab.src)
        .then((prefabConfig) => {
          prefabCollection.register(prefabConfig);
        });
    }));

    await sceneProvider.loadScene(mainConfig.startScene);
    sceneProvider.moveToLoaded();

    const gameLoop = new GameLoop();
    gameLoop.run();

    window.onblur = () => gameLoop.stop();
    window.onfocus = () => gameLoop.run();
  }
}

export default Engine;
