import ScopeProvider from './scope/scopeProvider';
import IOC from './ioc/ioc';
import ResolveSingletonStrategy from './ioc/resolveSingletonStrategy';

import { SceneProvider } from './scene/scene-provider';
import ResourceLoader from './resourceLoader/resourceLoader';
import GameObjectCreator from './gameObject/gameObjectCreator';
import PrefabCollection from './prefab/prefabCollection';
import { GameLoop } from './game-loop';

import * as global from './consts/global';

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
      RESOURCES_LOADER_KEY_NAME,
      PREFAB_COLLECTION_KEY_NAME,
      PROJECT_SETTINGS_KEY_NAME,
      GAME_OBJECT_CREATOR_KEY_NAME,
    } = global;

    const {
      mainConfig, processorsPlugins, components, pluginHelpers,
    } = this.options;
    const { projectSettings } = mainConfig;

    IOC.register(PROJECT_SETTINGS_KEY_NAME, new ResolveSingletonStrategy(projectSettings));

    const resourceLoader = new ResourceLoader();
    IOC.register(RESOURCES_LOADER_KEY_NAME, new ResolveSingletonStrategy(resourceLoader));

    const prefabCollection = new PrefabCollection(components);
    IOC.register(PREFAB_COLLECTION_KEY_NAME, new ResolveSingletonStrategy(prefabCollection));

    const gameObjectCreator = new GameObjectCreator(components);
    IOC.register(GAME_OBJECT_CREATOR_KEY_NAME, new ResolveSingletonStrategy(gameObjectCreator));

    const sceneProvider = new SceneProvider(mainConfig.scenes, processorsPlugins, pluginHelpers);

    for (let i = 0; i < mainConfig.prefabs.length; i += 1) {
      // For pure async await syntax in method. Need to refactor later
      // eslint-disable-next-line no-await-in-loop
      const prefabConfig = await resourceLoader.load(mainConfig.prefabs[i].src);
      prefabCollection.register(prefabConfig);
    }

    await sceneProvider.loadScene(mainConfig.startScene);
    sceneProvider.moveToLoaded();

    const gameLoop = new GameLoop(sceneProvider);
    gameLoop.run();

    window.onblur = () => gameLoop.stop();
    window.onfocus = () => gameLoop.run();
  }
}

export default Engine;
