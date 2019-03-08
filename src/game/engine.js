import ScopeProvider from 'core/scope/scopeProvider';
import IOC from 'core/ioc/ioc';
import ResolveSingletonStrategy from 'core/ioc/resolveSingletonStrategy';

import ResourceLoader from 'core/resourceLoader/resourceLoader';

import * as global from 'consts/global';

import GameObjectCreator from 'game/gameObject/gameObjectCreator';
import ActionResolver from 'game/actionResolver';
import GameLoop from 'game/gameLoop';

import KeyResolver from 'game/processors/inputProcessor/keyResolver';

import SceneProvider from 'game/scene/sceneProvider';

import ProcessorLoader from 'game/processorLoader/processorLoader';

class Engine {
  constructor(options) {
    const {
      SCENE_PROVIDER_KEY_NAME,
      RESOURCES_LOADER_KEY_NAME,
      ACTION_RESOLVER_KEY_NAME,
      KEY_RESOLVER_KEY_NAME,
      GAME_OBJECT_CREATOR_KEY_NAME,
      WINDOW_KEY_NAME,
    } = global;

    this.options = options;

    ScopeProvider.createScope(global.GENERAL_SCOPE_NAME);
    ScopeProvider.setCurrentScope(global.GENERAL_SCOPE_NAME);

    IOC.register(SCENE_PROVIDER_KEY_NAME, new ResolveSingletonStrategy(new SceneProvider()));
    IOC.register(RESOURCES_LOADER_KEY_NAME, new ResolveSingletonStrategy(new ResourceLoader()));
    IOC.register(ACTION_RESOLVER_KEY_NAME, new ResolveSingletonStrategy(new ActionResolver()));
    IOC.register(KEY_RESOLVER_KEY_NAME, new ResolveSingletonStrategy(new KeyResolver()));
    IOC.register(
      GAME_OBJECT_CREATOR_KEY_NAME,
      new ResolveSingletonStrategy(new GameObjectCreator())
    );
    IOC.register(WINDOW_KEY_NAME, new ResolveSingletonStrategy(this.options.window));

    this.processorSections = {
      eventProcessSection: {
        processors: [
          {
            name: 'inputProcessor',
          },
        ],
      },
      gameStateUpdateSection: {
        processors: [],
      },
      renderingSection: {
        processors: [
          {
            name: 'renderProcessor',
            resources: {
              textureAtlas: this.options.textureAtlas.texture,
              textureAtlasMap: this.options.textureAtlas.descriptor,
            },
          },
        ],
      },
    };
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

    await Promise.all(mainConfig.scenes.map((scene) => {
      return resourceLoader.load(scene.src)
        .then((sceneConfig) => {
          sceneProvider.createScene(sceneConfig);
        });
    }));
    sceneProvider.setCurrentScene(mainConfig.startScene);

    await Promise.all(mainConfig.prefabs.map((prefab) => {
      return resourceLoader.load(prefab.src)
        .then((prefabConfig) => {
          gameObjectCreator.register(prefabConfig);
        });
    }));

    const processorLoader = new ProcessorLoader();
    const loadableSections = Object.keys(global.SECTIONS).reduce((loadable, key) => {
      const sectionName = global.SECTIONS[key];
      const section = this.processorSections[sectionName];

      const loadableProcessors = section.processors.map((processor) => {
        return processorLoader.load(processor.name, processor.resources);
      });

      loadable.push(Promise.all(loadableProcessors)
        .then((processors) => {
          IOC.register(sectionName, new ResolveSingletonStrategy(processors));
        })
      );

      return loadable;
    }, []);
    await Promise.all(loadableSections);

    const gameLoop = new GameLoop();
    gameLoop.run();
  }
}

export default Engine;
