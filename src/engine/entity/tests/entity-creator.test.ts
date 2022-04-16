import type { Component } from '../../component';
import ScopeProvider from '../../scope/scopeProvider';
import IOC from '../../ioc/ioc';
import ResolveSingletonStrategy from '../../ioc/resolveSingletonStrategy';
import { PrefabCollection } from '../../prefab';
import { createMockComponent } from '../../../__mocks__';
import { GENERAL_SCOPE_NAME, PREFAB_COLLECTION_KEY_NAME } from '../../consts/global';
import { EntityCreator } from '..';

import entityExample from './jsons/entity-example.json';
import prefabExample from './jsons/prefab-example.json';
import entityFromPrefabExample from './jsons/entity-from-prefab-example.json';

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

describe('Engine -> EntityCreator', () => {
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
    const entityCreator = new EntityCreator(components);

    const entities = entityCreator.create(entityExample);

    expect(entities.length).toBe(2);

    expect(entities[0].id).toBe('001');
    expect(entities[0].name).toBe('entityExample');
    expect(entities[0].type).toBe('example');

    expect(entities[1].id).toBe('002');
    expect(entities[1].name).toBe('childExample');
    expect(entities[1].type).toBe('exampleChild');

    expect(entities[0].getChildren().length).toBe(1);
    expect(entities[0].getChildren()[0]).toBe(entities[1]);
    expect(entities[1].parent).toBe(entities[0]);

    expect(entities[0].getComponentNamesList()).toStrictEqual(['test1', 'test2']);

    expect((entities[0].getComponent('test1') as TestComponent1).testField1).toBe('testField1Value');
    expect((entities[0].getComponent('test1') as TestComponent1).testField2).toBe(true);
    expect((entities[0].getComponent('test1') as TestComponent1).testField3).toBe(100);

    expect((entities[0].getComponent('test2') as TestComponent2).testField4).toBe('testField4Value');
    expect((entities[0].getComponent('test2') as TestComponent2).testField5).toBe(false);
    expect((entities[0].getComponent('test2') as TestComponent2).testField6).toBe(300);

    expect(entities[1].getComponent('test1')).toBeUndefined();

    expect((entities[1].getComponent('test2') as TestComponent2).testField4).toBe('testField4ValueChild');
    expect((entities[1].getComponent('test2') as TestComponent2).testField5).toBe(true);
    expect((entities[1].getComponent('test2') as TestComponent2).testField6).toBe(450);
  });

  it('Creates game object from prefab', () => {
    const entityCreator = new EntityCreator(components);

    const entities = entityCreator.create(entityFromPrefabExample);

    expect(entities.length).toBe(3);

    expect(entities[0].id).toBe('003');
    expect(entities[0].name).toBe('entityFromPrefabExample');
    expect(entities[0].type).toBe('example');
    expect(entities[0].prefabName).toBe('prefabExample');

    expect(entities[1].id).toBe('004');
    expect(entities[1].name).toBe('childFromPrefabExample1');
    expect(entities[1].type).toBe('exampleChild');
    expect(entities[1].prefabName).toBe('childPrefabExample');

    expect(entities[2].id).toBe('005');
    expect(entities[2].name).toBe('childFromPrefabExample2');
    expect(entities[2].type).toBe('exampleChild');
    expect(entities[2].prefabName).toBeUndefined();

    expect(entities[0].getChildren().length).toBe(2);
    expect(entities[0].getChildren()[0]).toBe(entities[1]);
    expect(entities[0].getChildren()[1]).toBe(entities[2]);
    expect(entities[1].parent).toBe(entities[0]);
    expect(entities[2].parent).toBe(entities[0]);

    expect(entities[0].getComponentNamesList()).toStrictEqual(['test2', 'test1']);

    expect((entities[0].getComponent('test1') as TestComponent1).testField1).toBe('testField1ValueFromPrefab');
    expect((entities[0].getComponent('test1') as TestComponent1).testField2).toBe(false);
    expect((entities[0].getComponent('test1') as TestComponent1).testField3).toBe(100);

    expect((entities[0].getComponent('test2') as TestComponent2).testField4).toBe('testField4ValuePrefab');
    expect((entities[0].getComponent('test2') as TestComponent2).testField5).toBe(true);
    expect((entities[0].getComponent('test2') as TestComponent2).testField6).toBe(200);

    expect((entities[1].getComponent('test1') as TestComponent1).testField1).toBe('testField1ValueChild');
    expect((entities[1].getComponent('test1') as TestComponent1).testField2).toBe(false);
    expect((entities[1].getComponent('test1') as TestComponent1).testField3).toBe(350);

    expect((entities[1].getComponent('test2') as TestComponent2).testField4).toBe('testField4ValueChild');
    expect((entities[1].getComponent('test2') as TestComponent2).testField5).toBe(true);
    expect((entities[1].getComponent('test2') as TestComponent2).testField6).toBe(750);

    expect((entities[2].getComponent('test1') as TestComponent1).testField1).toBe('testField1ValueChild');
    expect((entities[2].getComponent('test1') as TestComponent1).testField2).toBe(false);
    expect((entities[2].getComponent('test1') as TestComponent1).testField3).toBe(950);
  });

  it('Creates game object from prefab without game object options', () => {
    const entityCreator = new EntityCreator(components);

    const entities = entityCreator.create({
      prefabName: 'prefabExample',
      fromPrefab: true,
      isNew: true,
    });

    expect(entities.length).toBe(2);

    expect(entities[0].id).toBeDefined();
    expect(entities[0].name).toBeDefined();
    expect(entities[0].type).toBe('example');
    expect(entities[0].prefabName).toBe('prefabExample');

    expect(entities[1].id).toBeDefined();
    expect(entities[1].name).toBe('childPrefabExample');
    expect(entities[1].type).toBe('exampleChild');
    expect(entities[1].prefabName).toBe('childPrefabExample');

    expect(entities[0].getChildren().length).toBe(1);
    expect(entities[0].getChildren()[0]).toBe(entities[1]);
    expect(entities[1].parent).toBe(entities[0]);

    expect(entities[0].getComponentNamesList()).toStrictEqual(['test2']);

    expect((entities[0].getComponent('test2') as TestComponent2).testField4).toBe('testField4ValuePrefab');
    expect((entities[0].getComponent('test2') as TestComponent2).testField5).toBe(true);
    expect((entities[0].getComponent('test2') as TestComponent2).testField6).toBe(200);

    expect((entities[1].getComponent('test1') as TestComponent1).testField1).toBe('testField1ValueChild');
    expect((entities[1].getComponent('test1') as TestComponent1).testField2).toBe(false);
    expect((entities[1].getComponent('test1') as TestComponent1).testField3).toBe(350);
  });
});
