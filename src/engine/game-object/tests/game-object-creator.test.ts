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

    const gameObject = gameObjectCreator.create(gameObjectExample);

    expect(gameObject.id).toBe('001');
    expect(gameObject.name).toBe('gameObjectExample');
    expect(gameObject.type).toBe('example');

    expect(gameObject.getChildren()[0].id).toBe('002');
    expect(gameObject.getChildren()[0].name).toBe('childExample');
    expect(gameObject.getChildren()[0].type).toBe('exampleChild');

    expect(gameObject.getChildren().length).toBe(1);
    expect(gameObject.getChildren()[0].parent).toBe(gameObject);

    expect(gameObject.getComponentNamesList()).toStrictEqual(['test1', 'test2']);

    expect((gameObject.getComponent('test1') as TestComponent1).testField1).toBe('testField1Value');
    expect((gameObject.getComponent('test1') as TestComponent1).testField2).toBe(true);
    expect((gameObject.getComponent('test1') as TestComponent1).testField3).toBe(100);

    expect((gameObject.getComponent('test2') as TestComponent2).testField4).toBe('testField4Value');
    expect((gameObject.getComponent('test2') as TestComponent2).testField5).toBe(false);
    expect((gameObject.getComponent('test2') as TestComponent2).testField6).toBe(300);

    expect(gameObject.getChildren()[0].getComponent('test1')).toBeUndefined();

    expect((gameObject.getChildren()[0].getComponent('test2') as TestComponent2).testField4).toBe('testField4ValueChild');
    expect((gameObject.getChildren()[0].getComponent('test2') as TestComponent2).testField5).toBe(true);
    expect((gameObject.getChildren()[0].getComponent('test2') as TestComponent2).testField6).toBe(450);
  });

  it('Creates game object from template', () => {
    const gameObjectCreator = new GameObjectCreator(components);

    const gameObject = gameObjectCreator.create(gameObjectFromTemplateExample);

    expect(gameObject.id).toBe('003');
    expect(gameObject.name).toBe('gameObjectFromTemplateExample');
    expect(gameObject.type).toBe('example');
    expect(gameObject.templateName).toBe('templateExample');

    expect(gameObject.getChildren()[0].id).toBe('004');
    expect(gameObject.getChildren()[0].name).toBe('childFromTemplateExample1');
    expect(gameObject.getChildren()[0].type).toBe('exampleChild');
    expect(gameObject.getChildren()[0].templateName).toBe('childTemplateExample');

    expect(gameObject.getChildren()[1].id).toBe('005');
    expect(gameObject.getChildren()[1].name).toBe('childFromTemplateExample2');
    expect(gameObject.getChildren()[1].type).toBe('exampleChild');
    expect(gameObject.getChildren()[1].templateName).toBeUndefined();

    expect(gameObject.getChildren().length).toBe(2);
    expect(gameObject.getChildren()[0].parent).toBe(gameObject);
    expect(gameObject.getChildren()[1].parent).toBe(gameObject);

    expect(gameObject.getComponentNamesList()).toStrictEqual(['test2', 'test1']);

    expect((gameObject.getComponent('test1') as TestComponent1).testField1).toBe('testField1ValueFromTemplate');
    expect((gameObject.getComponent('test1') as TestComponent1).testField2).toBe(false);
    expect((gameObject.getComponent('test1') as TestComponent1).testField3).toBe(100);

    expect((gameObject.getComponent('test2') as TestComponent2).testField4).toBe('testField4ValueTemplate');
    expect((gameObject.getComponent('test2') as TestComponent2).testField5).toBe(true);
    expect((gameObject.getComponent('test2') as TestComponent2).testField6).toBe(200);

    expect((gameObject.getChildren()[0].getComponent('test1') as TestComponent1).testField1).toBe('testField1ValueChild');
    expect((gameObject.getChildren()[0].getComponent('test1') as TestComponent1).testField2).toBe(false);
    expect((gameObject.getChildren()[0].getComponent('test1') as TestComponent1).testField3).toBe(350);

    expect((gameObject.getChildren()[0].getComponent('test2') as TestComponent2).testField4).toBe('testField4ValueChild');
    expect((gameObject.getChildren()[0].getComponent('test2') as TestComponent2).testField5).toBe(true);
    expect((gameObject.getChildren()[0].getComponent('test2') as TestComponent2).testField6).toBe(750);

    expect((gameObject.getChildren()[1].getComponent('test1') as TestComponent1).testField1).toBe('testField1ValueChild');
    expect((gameObject.getChildren()[1].getComponent('test1') as TestComponent1).testField2).toBe(false);
    expect((gameObject.getChildren()[1].getComponent('test1') as TestComponent1).testField3).toBe(950);
  });

  it('Creates game object from template without game object options', () => {
    const gameObjectCreator = new GameObjectCreator(components);

    const gameObject = gameObjectCreator.create({
      templateName: 'templateExample',
      fromTemplate: true,
      isNew: true,
    });

    expect(gameObject.id).toBeDefined();
    expect(gameObject.name).toBeDefined();
    expect(gameObject.type).toBe('example');
    expect(gameObject.templateName).toBe('templateExample');

    expect(gameObject.getChildren()[0].id).toBeDefined();
    expect(gameObject.getChildren()[0].name).toBe('childTemplateExample');
    expect(gameObject.getChildren()[0].type).toBe('exampleChild');
    expect(gameObject.getChildren()[0].templateName).toBe('childTemplateExample');

    expect(gameObject.getChildren().length).toBe(1);
    expect(gameObject.getChildren()[0].parent).toBe(gameObject);

    expect(gameObject.getComponentNamesList()).toStrictEqual(['test2']);

    expect((gameObject.getComponent('test2') as TestComponent2).testField4).toBe('testField4ValueTemplate');
    expect((gameObject.getComponent('test2') as TestComponent2).testField5).toBe(true);
    expect((gameObject.getComponent('test2') as TestComponent2).testField6).toBe(200);

    expect((gameObject.getChildren()[0].getComponent('test1') as TestComponent1).testField1).toBe('testField1ValueChild');
    expect((gameObject.getChildren()[0].getComponent('test1') as TestComponent1).testField2).toBe(false);
    expect((gameObject.getChildren()[0].getComponent('test1') as TestComponent1).testField3).toBe(350);
  });
});
