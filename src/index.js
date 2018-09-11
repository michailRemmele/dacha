import ScopeProvider from './core/scope/scopeProvider';
import IOC from './core/ioc/ioc';
import ResolveSingletonStrategy from './core/ioc/resolveSingletonStrategy';

import * as global from './consts/global';

import ActionResolver from './game/actionResolver';
import GameLoop from './game/gameLoop';

import KeyResolver from './game/inputSystem/keyResolver';

import SceneProvider from './game/scene/sceneProvider';

import mainConfig from 'resources/configurations/mainConfig';

import introSceneConfig from 'resources/configurations/scenes/intro';
import mainMenuSceneConfig from 'resources/configurations/scenes/mainMenu';
import gameScene from 'resources/configurations/scenes/gameScene';

const sceneConfigList = [
  introSceneConfig,
  mainMenuSceneConfig,
  gameScene,
];

const sceneProvider = new SceneProvider();
ScopeProvider.createScope(global.GENERAL_SCOPE_NAME);
ScopeProvider.setCurrentScope(global.GENERAL_SCOPE_NAME);

const actionResolver = new ActionResolver();
IOC.register(global.ACTION_RESOLVER_KEY_NAME, new ResolveSingletonStrategy(actionResolver));

const keyResolver = new KeyResolver();
IOC.register(global.KEY_RESOLVER_KEY_NAME, new ResolveSingletonStrategy(keyResolver));

sceneConfigList.forEach((sceneConfig) => {
  sceneProvider.createScene(sceneConfig);
});
sceneProvider.setCurrentScene(mainConfig.startScene);

IOC.register(global.SCENE_PROVIDER_KEY_NAME, new ResolveSingletonStrategy(sceneProvider));

const gameLoop = new GameLoop();
gameLoop.run();
