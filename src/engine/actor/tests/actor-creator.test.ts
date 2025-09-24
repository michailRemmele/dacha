import { Component } from '../../component';
import { TemplateCollection } from '../../template';
import { ActorCreator } from '..';

import actorExample from './jsons/actor-example.json';
import templateExample from './jsons/template-example.json';
import actorFromTemplateExample from './jsons/actor-from-template-example.json';

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

describe('Engine -> ActorCreator', () => {
  const components = [
    TestComponent1,
    TestComponent2,
  ];

  let templateCollection: TemplateCollection;

  beforeEach(() => {
    templateCollection = new TemplateCollection(components);
    templateCollection.register(templateExample);
  });

  it('Creates actor from scratch', () => {
    const actorCreator = new ActorCreator(components, templateCollection);

    const actor = actorCreator.create(actorExample);

    expect(actor.id).toBe('001');
    expect(actor.name).toBe('actorExample');

    expect(actor.children[0].id).toBe('002');
    expect(actor.children[0].name).toBe('childExample');

    expect(actor.children.length).toBe(1);
    expect(actor.children[0].parent).toBe(actor);

    expect(actor.getComponents()).toStrictEqual([
      actor.getComponent(TestComponent1),
      actor.getComponent(TestComponent2),
    ]);

    expect((actor.getComponent(TestComponent1)).testField1).toBe('testField1Value');
    expect((actor.getComponent(TestComponent1)).testField2).toBe(true);
    expect((actor.getComponent(TestComponent1)).testField3).toBe(100);

    expect((actor.getComponent(TestComponent2)).testField4).toBe('testField4Value');
    expect((actor.getComponent(TestComponent2)).testField5).toBe(false);
    expect((actor.getComponent(TestComponent2)).testField6).toBe(300);

    expect(actor.children[0].getComponent(TestComponent1)).toBeUndefined();

    expect((actor.children[0].getComponent(TestComponent2)).testField4).toBe('testField4ValueChild');
    expect((actor.children[0].getComponent(TestComponent2)).testField5).toBe(true);
    expect((actor.children[0].getComponent(TestComponent2)).testField6).toBe(450);
  });

  it('Creates actor from template', () => {
    const actorCreator = new ActorCreator(components, templateCollection);

    const actor = actorCreator.create(actorFromTemplateExample);

    expect(actor.id).toBe('003');
    expect(actor.name).toBe('actorFromTemplateExample');
    expect(actor.templateId).toBe('000');

    expect(actor.children[0].id).toBe('004');
    expect(actor.children[0].name).toBe('childFromTemplateExample1');
    expect(actor.children[0].templateId).toBe('001');

    expect(actor.children[1].id).toBe('005');
    expect(actor.children[1].name).toBe('childFromTemplateExample2');
    expect(actor.children[1].templateId).toBeUndefined();

    expect(actor.children.length).toBe(2);
    expect(actor.children[0].parent).toBe(actor);
    expect(actor.children[1].parent).toBe(actor);

    expect(actor.getComponents()).toStrictEqual([
      actor.getComponent(TestComponent2),
      actor.getComponent(TestComponent1),
    ]);

    expect((actor.getComponent(TestComponent1)).testField1).toBe('testField1ValueFromTemplate');
    expect((actor.getComponent(TestComponent1)).testField2).toBe(false);
    expect((actor.getComponent(TestComponent1)).testField3).toBe(100);

    expect((actor.getComponent(TestComponent2)).testField4).toBe('testField4ValueTemplate');
    expect((actor.getComponent(TestComponent2)).testField5).toBe(true);
    expect((actor.getComponent(TestComponent2)).testField6).toBe(200);

    expect((actor.children[0].getComponent(TestComponent1)).testField1).toBe('testField1ValueChild');
    expect((actor.children[0].getComponent(TestComponent1)).testField2).toBe(false);
    expect((actor.children[0].getComponent(TestComponent1)).testField3).toBe(350);

    expect((actor.children[0].getComponent(TestComponent2)).testField4).toBe('testField4ValueChild');
    expect((actor.children[0].getComponent(TestComponent2)).testField5).toBe(true);
    expect((actor.children[0].getComponent(TestComponent2)).testField6).toBe(750);

    expect((actor.children[1].getComponent(TestComponent1)).testField1).toBe('testField1ValueChild');
    expect((actor.children[1].getComponent(TestComponent1)).testField2).toBe(false);
    expect((actor.children[1].getComponent(TestComponent1)).testField3).toBe(950);
  });

  it('Creates actor from template without actor options', () => {
    const actorCreator = new ActorCreator(components, templateCollection);

    const actor = actorCreator.create({
      templateId: '000',
      isNew: true,
    });

    expect(actor.id).toBeDefined();
    expect(actor.name).toBeDefined();
    expect(actor.templateId).toBe('000');

    expect(actor.children[0].id).toBeDefined();
    expect(actor.children[0].name).toBe('childTemplateExample');
    expect(actor.children[0].templateId).toBe('001');

    expect(actor.children.length).toBe(1);
    expect(actor.children[0].parent).toBe(actor);

    expect(actor.getComponents()).toStrictEqual([
      actor.getComponent(TestComponent2),
    ]);

    expect((actor.getComponent(TestComponent2)).testField4).toBe('testField4ValueTemplate');
    expect((actor.getComponent(TestComponent2)).testField5).toBe(true);
    expect((actor.getComponent(TestComponent2)).testField6).toBe(200);

    expect((actor.children[0].getComponent(TestComponent1)).testField1).toBe('testField1ValueChild');
    expect((actor.children[0].getComponent(TestComponent1)).testField2).toBe(false);
    expect((actor.children[0].getComponent(TestComponent1)).testField3).toBe(350);
  });
});
