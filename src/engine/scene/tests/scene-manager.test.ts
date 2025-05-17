/* eslint-disable max-classes-per-file */
import { SceneManager } from '../scene-manager';
import { WorldSystem, SceneSystem } from '../../system';
import { TemplateCollection } from '../../template';

import { getSceneConfigMock } from './mocks/scene-config.mock';
import { getSystemConfigMock } from './mocks/system-config.mock';
import { SceneSystemMock, WorldSystemMock } from './mocks/system.mock';

class WorldSystem1 extends WorldSystemMock {}
WorldSystem1.systemName = 'world-system-1';

class SceneSystem2 extends SceneSystemMock {}
SceneSystem2.systemName = 'scene-system-2';

class WorldSystem3 extends WorldSystemMock {}
WorldSystem3.systemName = 'world-system-3';

class SceneSystem4 extends SceneSystemMock {}
SceneSystem4.systemName = 'scene-system-4';

describe('Engine -> SceneManager', () => {
  let loadWorldFn: jest.Mock;
  let loadWorldAsyncFn: () => Promise<void>;
  let readyWorldFn: jest.Mock;
  let destroyWorldFn: jest.Mock;

  let loadSceneFn: jest.Mock;
  let loadSceneAsyncFn: () => Promise<void>;
  let enterSceneFn: jest.Mock;
  let exitSceneFn: jest.Mock;
  let destroySceneFn: jest.Mock;

  let sceneManager: SceneManager;

  beforeEach(() => {
    loadWorldFn = jest.fn();
    loadWorldAsyncFn = (): Promise<void> => new Promise<void>((resolve) => {
      loadWorldFn();
      resolve();
    });
    readyWorldFn = jest.fn();
    destroyWorldFn = jest.fn();

    loadSceneFn = jest.fn();
    loadSceneAsyncFn = (): Promise<void> => new Promise<void>((resolve) => {
      loadSceneFn();
      resolve();
    });
    enterSceneFn = jest.fn();
    exitSceneFn = jest.fn();
    destroySceneFn = jest.fn();

    sceneManager = new SceneManager({
      sceneConfigs: [
        getSceneConfigMock('scene-1'),
        getSceneConfigMock('scene-2'),
        getSceneConfigMock('scene-3'),
      ],
      systemConfigs: [
        getSystemConfigMock('world-system-1'),
        getSystemConfigMock('scene-system-2'),
        getSystemConfigMock('world-system-3'),
        getSystemConfigMock('scene-system-4'),
      ],
      availableSystems: [
        WorldSystem1,
        SceneSystem2,
        WorldSystem3,
        SceneSystem4,
      ],
      components: [],
      globalOptions: {},
      resources: {
        [WorldSystem1.systemName]: {
          loadWorldFn: loadWorldAsyncFn,
          readyWorldFn,
          destroyWorldFn,
          loadSceneFn: loadSceneAsyncFn,
          enterSceneFn,
          exitSceneFn,
          destroySceneFn,
        },
        [SceneSystem2.systemName]: {
          loadSceneFn: loadSceneAsyncFn,
          enterSceneFn,
          exitSceneFn,
          destroySceneFn,
        },
        [WorldSystem3.systemName]: {
          loadWorldFn: loadWorldAsyncFn,
          readyWorldFn,
          destroyWorldFn,
          loadSceneFn: loadSceneAsyncFn,
          enterSceneFn,
          exitSceneFn,
          destroySceneFn,
        },
        [SceneSystem4.systemName]: {
          loadSceneFn: loadSceneAsyncFn,
          enterSceneFn,
          exitSceneFn,
          destroySceneFn,
        },
      },
      templateCollection: new TemplateCollection([]),
    });
  });

  it('Should return correct systems after load and entering a scene', async () => {
    expect(sceneManager.getSystems().length).toBe(2);
    expect(sceneManager.getSystems()[0]).toBeInstanceOf(WorldSystem);
    expect(sceneManager.getSystems()[1]).toBeInstanceOf(WorldSystem);

    await sceneManager.loadWorld();
    await sceneManager.loadScene('scene-2', true);

    expect(sceneManager.getSystems().length).toBe(4);
    expect(sceneManager.getSystems()[0]).toBeInstanceOf(WorldSystem);
    expect(sceneManager.getSystems()[1]).toBeInstanceOf(SceneSystem);
    expect(sceneManager.getSystems()[2]).toBeInstanceOf(WorldSystem);
    expect(sceneManager.getSystems()[3]).toBeInstanceOf(SceneSystem);
  });

  it('Should call all lifecycle methods', async () => {
    await sceneManager.loadWorld();
    await sceneManager.loadScene('scene-1');
    sceneManager.enterScene('scene-1');
    sceneManager.exitActiveScene();
    sceneManager.destroyScene('scene-1');
    sceneManager.destroyWorld();

    expect(loadWorldFn.mock.calls.length).toBe(2);
    expect(loadSceneFn.mock.calls.length).toBe(4);
    expect(enterSceneFn.mock.calls.length).toBe(4);
    expect(exitSceneFn.mock.calls.length).toBe(4);
    expect(destroySceneFn.mock.calls.length).toBe(4);
    expect(destroyWorldFn.mock.calls.length).toBe(2);
  });

  it('Can\'t exit or destroy the same scene more than once', async () => {
    await sceneManager.loadWorld();
    await sceneManager.loadScene('scene-3', true);

    sceneManager.exitActiveScene();
    sceneManager.exitActiveScene();
    sceneManager.exitActiveScene();

    sceneManager.destroyScene('scene-1');
    sceneManager.destroyScene('scene-1');

    sceneManager.destroyWorld();

    expect(exitSceneFn.mock.calls.length).toBe(4);
    expect(destroySceneFn.mock.calls.length).toBe(4);
  });

  it('Should ignore extra load scene calls and destroy old scene instances', async () => {
    await sceneManager.loadWorld();
    await sceneManager.loadScene('scene-2', true);

    expect(loadSceneFn.mock.calls.length).toBe(4);
    expect(enterSceneFn.mock.calls.length).toBe(4);
    expect(exitSceneFn.mock.calls.length).toBe(0);
    expect(destroySceneFn.mock.calls.length).toBe(0);

    await sceneManager.loadScene('scene-2');
    await sceneManager.loadScene('scene-2');

    expect(loadSceneFn.mock.calls.length).toBe(12);
    expect(enterSceneFn.mock.calls.length).toBe(4);
    expect(exitSceneFn.mock.calls.length).toBe(4);
    expect(destroySceneFn.mock.calls.length).toBe(8);

    const promise = sceneManager.loadScene('scene-2');
    await sceneManager.loadScene('scene-2');
    await promise;

    expect(loadSceneFn.mock.calls.length).toBe(16);
    expect(enterSceneFn.mock.calls.length).toBe(4);
    expect(exitSceneFn.mock.calls.length).toBe(4);
    expect(destroySceneFn.mock.calls.length).toBe(12);
  });

  it('Throws error if enter loading scene', async () => {
    await sceneManager.loadWorld();

    const promise = sceneManager.loadScene('scene-1');

    expect(() => {
      sceneManager.enterScene('scene-1');
    }).toThrow();

    await promise;

    sceneManager.enterScene('scene-1');

    expect(loadSceneFn.mock.calls.length).toBe(4);
    expect(enterSceneFn.mock.calls.length).toBe(4);
  });

  it('Can\'t enter already active scene', async () => {
    await sceneManager.loadWorld();
    await sceneManager.loadScene('scene-3', true);

    sceneManager.enterScene('scene-3', true);
    sceneManager.enterScene('scene-3');

    expect(loadSceneFn.mock.calls.length).toBe(4);
    expect(enterSceneFn.mock.calls.length).toBe(4);
  });
});
