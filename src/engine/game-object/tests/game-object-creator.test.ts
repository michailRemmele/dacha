import type { Component } from '../../component';
import ScopeProvider from '../../scope/scopeProvider';
import IOC from '../../ioc/ioc';
import ResolveSingletonStrategy from '../../ioc/resolveSingletonStrategy';
import { TemplateCollection } from '../../template';
import { createMockComponent } from '../../../__mocks__';
import { GENERAL_SCOPE_NAME, TEMPLATE_COLLECTION_KEY_NAME } from '../../consts/global';
import { GameObjectCreator } from '..';

import gameObjectExample from './jsons/game-object-example.json';
import templateExample from './jsons/template-example.json';
import gameObjectFromTemplateExample from './jsons/game-object-from-template-example.json';

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

    const templateCollection = new TemplateCollection(components);
    templateCollection.register(templateExample);

    IOC.register(TEMPLATE_COLLECTION_KEY_NAME, new ResolveSingletonStrategy(templateCollection));
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

  it('Creates game object from template', () => {
    const gameObjectCreator = new GameObjectCreator(components);

    const gameObjects = gameObjectCreator.create(gameObjectFromTemplateExample);

    expect(gameObjects.length).toBe(3);

    expect(gameObjects[0].id).toBe('003');
    expect(gameObjects[0].name).toBe('gameObjectFromTemplateExample');
    expect(gameObjects[0].type).toBe('example');
    expect(gameObjects[0].templateName).toBe('templateExample');

    expect(gameObjects[1].id).toBe('004');
    expect(gameObjects[1].name).toBe('childFromTemplateExample1');
    expect(gameObjects[1].type).toBe('exampleChild');
    expect(gameObjects[1].templateName).toBe('childTemplateExample');

    expect(gameObjects[2].id).toBe('005');
    expect(gameObjects[2].name).toBe('childFromTemplateExample2');
    expect(gameObjects[2].type).toBe('exampleChild');
    expect(gameObjects[2].templateName).toBeUndefined();

    expect(gameObjects[0].getChildren().length).toBe(2);
    expect(gameObjects[0].getChildren()[0]).toBe(gameObjects[1]);
    expect(gameObjects[0].getChildren()[1]).toBe(gameObjects[2]);
    expect(gameObjects[1].parent).toBe(gameObjects[0]);
    expect(gameObjects[2].parent).toBe(gameObjects[0]);

    expect(gameObjects[0].getComponentNamesList()).toStrictEqual(['test2', 'test1']);

    expect((gameObjects[0].getComponent('test1') as TestComponent1).testField1).toBe('testField1ValueFromTemplate');
    expect((gameObjects[0].getComponent('test1') as TestComponent1).testField2).toBe(false);
    expect((gameObjects[0].getComponent('test1') as TestComponent1).testField3).toBe(100);

    expect((gameObjects[0].getComponent('test2') as TestComponent2).testField4).toBe('testField4ValueTemplate');
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

  it('Creates game object from template without game object options', () => {
    const gameObjectCreator = new GameObjectCreator(components);

    const gameObjects = gameObjectCreator.create({
      templateName: 'templateExample',
      fromTemplate: true,
      isNew: true,
    });

    expect(gameObjects.length).toBe(2);

    expect(gameObjects[0].id).toBeDefined();
    expect(gameObjects[0].name).toBeDefined();
    expect(gameObjects[0].type).toBe('example');
    expect(gameObjects[0].templateName).toBe('templateExample');

    expect(gameObjects[1].id).toBeDefined();
    expect(gameObjects[1].name).toBe('childTemplateExample');
    expect(gameObjects[1].type).toBe('exampleChild');
    expect(gameObjects[1].templateName).toBe('childTemplateExample');

    expect(gameObjects[0].getChildren().length).toBe(1);
    expect(gameObjects[0].getChildren()[0]).toBe(gameObjects[1]);
    expect(gameObjects[1].parent).toBe(gameObjects[0]);

    expect(gameObjects[0].getComponentNamesList()).toStrictEqual(['test2']);

    expect((gameObjects[0].getComponent('test2') as TestComponent2).testField4).toBe('testField4ValueTemplate');
    expect((gameObjects[0].getComponent('test2') as TestComponent2).testField5).toBe(true);
    expect((gameObjects[0].getComponent('test2') as TestComponent2).testField6).toBe(200);

    expect((gameObjects[1].getComponent('test1') as TestComponent1).testField1).toBe('testField1ValueChild');
    expect((gameObjects[1].getComponent('test1') as TestComponent1).testField2).toBe(false);
    expect((gameObjects[1].getComponent('test1') as TestComponent1).testField3).toBe(350);
  });
});
