import ScopeProvider from 'core/scope/scopeProvider';
import IOC from 'core/ioc/ioc';
import ResolveSingletonStrategy from 'core/ioc/resolveSingletonStrategy';

import ResourceLoader from 'core/resourceLoader/resourceLoader';

import * as global from 'consts/global';

import ActionResolver from 'game/actionResolver';
import GameLoop from 'game/gameLoop';

import KeyResolver from 'game/processors/inputProcessor/keyResolver';

import SceneProvider from 'game/scene/sceneProvider';

import ProcessorLoader from 'game/processorLoader/processorLoader';

class Engine {
  constructor() {
    ScopeProvider.createScope(global.GENERAL_SCOPE_NAME);
    ScopeProvider.setCurrentScope(global.GENERAL_SCOPE_NAME);

    const sceneProvider = new SceneProvider();
    IOC.register(global.SCENE_PROVIDER_KEY_NAME, new ResolveSingletonStrategy(sceneProvider));

    const resourceLoader = new ResourceLoader();
    IOC.register(global.RESOURCES_LOADER_KEY_NAME, new ResolveSingletonStrategy(resourceLoader));

    const actionResolver = new ActionResolver();
    IOC.register(global.ACTION_RESOLVER_KEY_NAME, new ResolveSingletonStrategy(actionResolver));

    const keyResolver = new KeyResolver();
    IOC.register(global.KEY_RESOLVER_KEY_NAME, new ResolveSingletonStrategy(keyResolver));
  }

  async start() {
    const resourceLoader = IOC.resolve(global.RESOURCES_LOADER_KEY_NAME);
    const sceneProvider = IOC.resolve(global.SCENE_PROVIDER_KEY_NAME);

    const mainConfigPath = `${global.CONFIG_PATH}/${global.MAIN_CONFIG_SRC}`;
    const processorsConfigPath = `${global.CONFIG_PATH}/${global.PROCESSORS_CONFIG_SRC}`;

    const mainConfig = await resourceLoader.load(mainConfigPath);

    await Promise.all(mainConfig.scenes.map((scene) => {
      return resourceLoader.load(`${global.CONFIG_PATH}/${scene.src}`)
        .then((sceneConfig) => {
          sceneProvider.createScene(sceneConfig);
        });
    }));
    sceneProvider.setCurrentScene(mainConfig.startScene);

    const processorsConfig = await resourceLoader.load(processorsConfigPath);

    const processorLoader = new ProcessorLoader();
    const loadableSections = Object.keys(global.SECTIONS).reduce((loadable, key) => {
      const sectionName = global.SECTIONS[key];
      const section = processorsConfig.sections[sectionName];

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
