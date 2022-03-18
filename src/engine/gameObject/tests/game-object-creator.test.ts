import type { Component } from '../../component';
import ScopeProvider from '../../scope/scopeProvider';
import IOC from '../../ioc/ioc';
import ResolveSingletonStrategy from '../../ioc/resolveSingletonStrategy';
import { PrefabCollection } from '../../prefab';
import { createMockComponent } from '../../../__mocks__';
import { GENERAL_SCOPE_NAME, PREFAB_COLLECTION_KEY_NAME } from '../../consts/global';
import { GameObjectCreator } from '..';

import gameObjectExample from './jsons/game-object-example.json';
import prefabExample from './jsons/prefab-example.json';
import gameObjectFromPrefabExample from './jsons/game-object-from-prefab-example.json';

interface TestComponent1 extends Component {
  testField1: string
  testField2: boolean
  testField3: number
}

interface TestComponent2 extends Component {
  testField4: string
  testField5: boolean
  testField6: number
}

describe('Engine -> GameObjectCreator', () => {
  function createTestComponent1(name: string, config: Record<string, unknown>): Component {
    return createMockComponent(name, config);
  }
  function createTestComponent2(name: string, config: Record<string, unknown>): Component {
    return createMockComponent(name, config);
  }

  const components = {
    test1: createTestComponent1 as unknown as { new(): Component },
    test2: createTestComponent2 as unknown as { new(): Component },
  };

  beforeEach(() => {
    ScopeProvider.createScope(GENERAL_SCOPE_NAME);
    ScopeProvider.setCurrentScope(GENERAL_SCOPE_NAME);

    const prefabCollection = new PrefabCollection(components);
    prefabCollection.register(prefabExample);

    IOC.register(PREFAB_COLLECTION_KEY_NAME, new ResolveSingletonStrategy(prefabCollection));
  });

  it('Creates game object from scratch', () => {
    const gameObjectCreator = new GameObjectCreator(components);

    const gameObjects = gameObjectCreator.create(gameObjectExample);

    expect(gameObjects.length).toBe(2);

    expect(gameObjects[0].id).toBe('001');
    expect(gameObjects[0].name).toBe('gameObjectExample');
    expect(gameObjects[0].type).toBe('example');

    expect(gameObjects[1].id).toBe('002');
    expect(gameObjects[1].name).toBe('childExample');
    expect(gameObjects[1].type).toBe('exampleChild');

    expect(gameObjects[0].getChildren().length).toBe(1);
    expect(gameObjects[0].getChildren()[0]).toBe(gameObjects[1]);
    expect(gameObjects[1].parent).toBe(gameObjects[0]);

    expect(gameObjects[0].getComponentNamesList()).toStrictEqual(['test1', 'test2']);

    expect((gameObjects[0].getComponent('test1') as TestComponent1).testField1).toBe('testField1Value');
    expect((gameObjects[0].getComponent('test1') as TestComponent1).testField2).toBe(true);
    expect((gameObjects[0].getComponent('test1') as TestComponent1).testField3).toBe(100);

    expect((gameObjects[0].getComponent('test2') as TestComponent2).testField4).toBe('testField4Value');
    expect((gameObjects[0].getComponent('test2') as TestComponent2).testField5).toBe(false);
    expect((gameObjects[0].getComponent('test2') as TestComponent2).testField6).toBe(300);

    expect(gameObjects[1].getComponent('test1')).toBeUndefined();

    expect((gameObjects[1].getComponent('test2') as TestComponent2).testField4).toBe('testField4ValueChild');
    expect((gameObjects[1].getComponent('test2') as TestComponent2).testField5).toBe(true);
    expect((gameObjects[1].getComponent('test2') as TestComponent2).testField6).toBe(450);
  });

  it('Creates game object from prefab', () => {
    const gameObjectCreator = new GameObjectCreator(components);

    const gameObjects = gameObjectCreator.create(gameObjectFromPrefabExample);

    expect(gameObjects.length).toBe(3);

    expect(gameObjects[0].id).toBe('003');
    expect(gameObjects[0].name).toBe('gameObjectFromPrefabExample');
    expect(gameObjects[0].type).toBe('example');
    expect(gameObjects[0].prefabName).toBe('prefabExample');

    expect(gameObjects[1].id).toBe('004');
    expect(gameObjects[1].name).toBe('childFromPrefabExample1');
    expect(gameObjects[1].type).toBe('exampleChild');
    expect(gameObjects[1].prefabName).toBe('childPrefabExample');

    expect(gameObjects[2].id).toBe('005');
    expect(gameObjects[2].name).toBe('childFromPrefabExample2');
    expect(gameObjects[2].type).toBe('exampleChild');
    expect(gameObjects[2].prefabName).toBeUndefined();

    expect(gameObjects[0].getChildren().length).toBe(2);
    expect(gameObjects[0].getChildren()[0]).toBe(gameObjects[1]);
    expect(gameObjects[0].getChildren()[1]).toBe(gameObjects[2]);
    expect(gameObjects[1].parent).toBe(gameObjects[0]);
    expect(gameObjects[2].parent).toBe(gameObjects[0]);

    expect(gameObjects[0].getComponentNamesList()).toStrictEqual(['test2', 'test1']);

    expect((gameObjects[0].getComponent('test1') as TestComponent1).testField1).toBe('testField1ValueFromPrefab');
    expect((gameObjects[0].getComponent('test1') as TestComponent1).testField2).toBe(false);
    expect((gameObjects[0].getComponent('test1') as TestComponent1).testField3).toBe(100);

    expect((gameObjects[0].getComponent('test2') as TestComponent2).testField4).toBe('testField4ValuePrefab');
    expect((gameObjects[0].getComponent('test2') as TestComponent2).testField5).toBe(true);
    expect((gameObjects[0].getComponent('test2') as TestComponent2).testField6).toBe(200);

    expect((gameObjects[1].getComponent('test1') as TestComponent1).testField1).toBe('testField1ValueChild');
    expect((gameObjects[1].getComponent('test1') as TestComponent1).testField2).toBe(false);
    expect((gameObjects[1].getComponent('test1') as TestComponent1).testField3).toBe(350);

    expect((gameObjects[1].getComponent('test2') as TestComponent2).testField4).toBe('testField4ValueChild');
    expect((gameObjects[1].getComponent('test2') as TestComponent2).testField5).toBe(true);
    expect((gameObjects[1].getComponent('test2') as TestComponent2).testField6).toBe(750);

    expect((gameObjects[2].getComponent('test1') as TestComponent1).testField1).toBe('testField1ValueChild');
    expect((gameObjects[2].getComponent('test1') as TestComponent1).testField2).toBe(false);
    expect((gameObjects[2].getComponent('test1') as TestComponent1).testField3).toBe(950);
  });

  it('Creates game object from prefab without game object options', () => {
    const gameObjectCreator = new GameObjectCreator(components);

    const gameObjects = gameObjectCreator.create({
      prefabName: 'prefabExample',
      fromPrefab: true,
      isNew: true,
    });

    expect(gameObjects.length).toBe(2);

    expect(gameObjects[0].id).toBeDefined();
    expect(gameObjects[0].name).toBe('prefabExample');
    expect(gameObjects[0].type).toBe('example');
    expect(gameObjects[0].prefabName).toBe('prefabExample');

    expect(gameObjects[1].id).toBeDefined();
    expect(gameObjects[1].name).toBe('childPrefabExample');
    expect(gameObjects[1].type).toBe('exampleChild');
    expect(gameObjects[1].prefabName).toBe('childPrefabExample');

    expect(gameObjects[0].getChildren().length).toBe(1);
    expect(gameObjects[0].getChildren()[0]).toBe(gameObjects[1]);
    expect(gameObjects[1].parent).toBe(gameObjects[0]);

    expect(gameObjects[0].getComponentNamesList()).toStrictEqual(['test2']);

    expect((gameObjects[0].getComponent('test2') as TestComponent2).testField4).toBe('testField4ValuePrefab');
    expect((gameObjects[0].getComponent('test2') as TestComponent2).testField5).toBe(true);
    expect((gameObjects[0].getComponent('test2') as TestComponent2).testField6).toBe(200);

    expect((gameObjects[1].getComponent('test1') as TestComponent1).testField1).toBe('testField1ValueChild');
    expect((gameObjects[1].getComponent('test1') as TestComponent1).testField2).toBe(false);
    expect((gameObjects[1].getComponent('test1') as TestComponent1).testField3).toBe(350);
  });
});
