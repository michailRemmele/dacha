/* comment: mock classes for test */
/* eslint-disable max-classes-per-file */
import { Component } from '../../component';
import { TemplateCollection } from '../../template';
import { GameObjectCreator } from '..';

import gameObjectExample from './jsons/game-object-example.json';
import templateExample from './jsons/template-example.json';
import gameObjectFromTemplateExample from './jsons/game-object-from-template-example.json';

interface TestComponent1Config extends Record<string, unknown> {
  testField1: string
  testField2: boolean
  testField3: number
}

class TestComponent1 extends Component {
  static componentName = 'TestComponent1';

  testField1: string;
  testField2: boolean;
  testField3: number;

  constructor(config: Record<string, unknown>) {
    super();

    const { testField1, testField2, testField3 } = config as TestComponent1Config;

    this.testField1 = testField1;
    this.testField2 = testField2;
    this.testField3 = testField3;
  }

  clone(): Component {
    return new TestComponent1({
      testField1: this.testField1,
      testField2: this.testField2,
      testField3: this.testField3,
    });
  }
}

interface TestComponent2Config extends Record<string, unknown> {
  testField4: string
  testField5: boolean
  testField6: number
}

class TestComponent2 extends Component {
  static componentName = 'TestComponent2';

  testField4: string;
  testField5: boolean;
  testField6: number;

  constructor(config: Record<string, unknown>) {
    super();

    const { testField4, testField5, testField6 } = config as TestComponent2Config;

    this.testField4 = testField4;
    this.testField5 = testField5;
    this.testField6 = testField6;
  }

  clone(): Component {
    return new TestComponent2({
      testField4: this.testField4,
      testField5: this.testField5,
      testField6: this.testField6,
    });
  }
}

describe('Engine -> GameObjectCreator', () => {
  const components = [
    TestComponent1,
    TestComponent2,
  ];

  let templateCollection: TemplateCollection;

  beforeEach(() => {
    templateCollection = new TemplateCollection(components);
    templateCollection.register(templateExample);
  });

  it('Creates game object from scratch', () => {
    const gameObjectCreator = new GameObjectCreator(components, templateCollection);

    const gameObject = gameObjectCreator.create(gameObjectExample);

    expect(gameObject.id).toBe('001');
    expect(gameObject.name).toBe('gameObjectExample');

    expect(gameObject.getChildren()[0].id).toBe('002');
    expect(gameObject.getChildren()[0].name).toBe('childExample');

    expect(gameObject.getChildren().length).toBe(1);
    expect(gameObject.getChildren()[0].parent).toBe(gameObject);

    expect(gameObject.getComponents()).toStrictEqual([
      gameObject.getComponent(TestComponent1),
      gameObject.getComponent(TestComponent2),
    ]);

    expect((gameObject.getComponent(TestComponent1)).testField1).toBe('testField1Value');
    expect((gameObject.getComponent(TestComponent1)).testField2).toBe(true);
    expect((gameObject.getComponent(TestComponent1)).testField3).toBe(100);

    expect((gameObject.getComponent(TestComponent2)).testField4).toBe('testField4Value');
    expect((gameObject.getComponent(TestComponent2)).testField5).toBe(false);
    expect((gameObject.getComponent(TestComponent2)).testField6).toBe(300);

    expect(gameObject.getChildren()[0].getComponent(TestComponent1)).toBeUndefined();

    expect((gameObject.getChildren()[0].getComponent(TestComponent2)).testField4).toBe('testField4ValueChild');
    expect((gameObject.getChildren()[0].getComponent(TestComponent2)).testField5).toBe(true);
    expect((gameObject.getChildren()[0].getComponent(TestComponent2)).testField6).toBe(450);
  });

  it('Creates game object from template', () => {
    const gameObjectCreator = new GameObjectCreator(components, templateCollection);

    const gameObject = gameObjectCreator.create(gameObjectFromTemplateExample);

    expect(gameObject.id).toBe('003');
    expect(gameObject.name).toBe('gameObjectFromTemplateExample');
    expect(gameObject.templateId).toBe('000');

    expect(gameObject.getChildren()[0].id).toBe('004');
    expect(gameObject.getChildren()[0].name).toBe('childFromTemplateExample1');
    expect(gameObject.getChildren()[0].templateId).toBe('001');

    expect(gameObject.getChildren()[1].id).toBe('005');
    expect(gameObject.getChildren()[1].name).toBe('childFromTemplateExample2');
    expect(gameObject.getChildren()[1].templateId).toBeUndefined();

    expect(gameObject.getChildren().length).toBe(2);
    expect(gameObject.getChildren()[0].parent).toBe(gameObject);
    expect(gameObject.getChildren()[1].parent).toBe(gameObject);

    expect(gameObject.getComponents()).toStrictEqual([
      gameObject.getComponent(TestComponent2),
      gameObject.getComponent(TestComponent1),
    ]);

    expect((gameObject.getComponent(TestComponent1)).testField1).toBe('testField1ValueFromTemplate');
    expect((gameObject.getComponent(TestComponent1)).testField2).toBe(false);
    expect((gameObject.getComponent(TestComponent1)).testField3).toBe(100);

    expect((gameObject.getComponent(TestComponent2)).testField4).toBe('testField4ValueTemplate');
    expect((gameObject.getComponent(TestComponent2)).testField5).toBe(true);
    expect((gameObject.getComponent(TestComponent2)).testField6).toBe(200);

    expect((gameObject.getChildren()[0].getComponent(TestComponent1)).testField1).toBe('testField1ValueChild');
    expect((gameObject.getChildren()[0].getComponent(TestComponent1)).testField2).toBe(false);
    expect((gameObject.getChildren()[0].getComponent(TestComponent1)).testField3).toBe(350);

    expect((gameObject.getChildren()[0].getComponent(TestComponent2)).testField4).toBe('testField4ValueChild');
    expect((gameObject.getChildren()[0].getComponent(TestComponent2)).testField5).toBe(true);
    expect((gameObject.getChildren()[0].getComponent(TestComponent2)).testField6).toBe(750);

    expect((gameObject.getChildren()[1].getComponent(TestComponent1)).testField1).toBe('testField1ValueChild');
    expect((gameObject.getChildren()[1].getComponent(TestComponent1)).testField2).toBe(false);
    expect((gameObject.getChildren()[1].getComponent(TestComponent1)).testField3).toBe(950);
  });

  it('Creates game object from template without game object options', () => {
    const gameObjectCreator = new GameObjectCreator(components, templateCollection);

    const gameObject = gameObjectCreator.create({
      templateId: '000',
      fromTemplate: true,
      isNew: true,
    });

    expect(gameObject.id).toBeDefined();
    expect(gameObject.name).toBeDefined();
    expect(gameObject.templateId).toBe('000');

    expect(gameObject.getChildren()[0].id).toBeDefined();
    expect(gameObject.getChildren()[0].name).toBe('childTemplateExample');
    expect(gameObject.getChildren()[0].templateId).toBe('001');

    expect(gameObject.getChildren().length).toBe(1);
    expect(gameObject.getChildren()[0].parent).toBe(gameObject);

    expect(gameObject.getComponents()).toStrictEqual([
      gameObject.getComponent(TestComponent2),
    ]);

    expect((gameObject.getComponent(TestComponent2)).testField4).toBe('testField4ValueTemplate');
    expect((gameObject.getComponent(TestComponent2)).testField5).toBe(true);
    expect((gameObject.getComponent(TestComponent2)).testField6).toBe(200);

    expect((gameObject.getChildren()[0].getComponent(TestComponent1)).testField1).toBe('testField1ValueChild');
    expect((gameObject.getChildren()[0].getComponent(TestComponent1)).testField2).toBe(false);
    expect((gameObject.getChildren()[0].getComponent(TestComponent1)).testField3).toBe(350);
  });
});
