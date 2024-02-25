import { Component } from '../../../../engine/component';
import { Actor } from '../../../../engine/actor/actor';
import { getValue, setValue } from '../utils';

interface TestComponentConfig extends Record<string, unknown> {
  testField: string
}

class TestComponent extends Component {
  static componentName = 'TestComponent';
  testField: string;

  constructor(config: Record<string, unknown>) {
    super();

    this.testField = (config as TestComponentConfig).testField;
  }

  clone(): Component {
    return new TestComponent({
      testField: this.testField,
    });
  }
}

describe('Contrib -> Animator -> utils', () => {
  describe('getValue()', () => {
    it('Returns actor component value', () => {
      const actor = new Actor({
        id: '1',
        name: 'actor-1',
      });

      const component = new TestComponent({ testField: 'testFieldValue' });
      actor.setComponent(component);

      expect(getValue(actor, ['components', 'TestComponent', 'testField'])).toBe('testFieldValue');
      expect(getValue(actor, ['components', 'TestComponent', 'notExistField'])).toBeUndefined();
    });

    it('Returns child component value', () => {
      const actor1 = new Actor({
        id: '1',
        name: 'actor-1',
      });
      const actor2 = new Actor({
        id: '2',
        name: 'actor-2',
      });

      actor1.appendChild(actor2);

      const component = new TestComponent({ testField: 'testFieldValue2' });
      actor2.setComponent(component);

      expect(
        getValue(
          actor1,
          ['children', 'actor-2', 'components', 'TestComponent', 'testField'],
        ),
      ).toBe('testFieldValue2');
      expect(
        getValue(
          actor1,
          ['children', 'actor-2', 'components', 'NotExistComponent', 'testField'],
        ),
      ).toBeUndefined();
    });

    it('Returns grandchild component value', () => {
      const actor1 = new Actor({
        id: '1',
        name: 'actor-1',
      });
      const actor2 = new Actor({
        id: '2',
        name: 'actor-2',
      });
      const actor3 = new Actor({
        id: '3',
        name: 'actor-3',
      });

      actor1.appendChild(actor2);
      actor2.appendChild(actor3);

      const component = new TestComponent({ testField: 'testFieldValue3' });
      actor3.setComponent(component);

      expect(
        getValue(
          actor1,
          ['children', 'actor-2', 'children', 'actor-3', 'components', 'TestComponent', 'testField'],
        ),
      ).toBe('testFieldValue3');
      expect(
        getValue(
          actor1,
          ['children', 'actor-2', 'children', 'notExistActor', 'components', 'TestComponent', 'testField'],
        ),
      ).toBeUndefined();
    });
  });

  describe('setValue()', () => {
    it('Updates actor component value', () => {
      const actor = new Actor({
        id: '1',
        name: 'actor-1',
      });

      const component = new TestComponent({ testField: 'testFieldValue' });
      actor.setComponent(component);

      setValue(actor, ['components', 'TestComponent', 'testField'], 'updatedValue');

      expect((actor.getComponent(TestComponent)).testField).toBe('updatedValue');
    });

    it('Updates child component value', () => {
      const actor1 = new Actor({
        id: '1',
        name: 'actor-1',
      });
      const actor2 = new Actor({
        id: '2',
        name: 'actor-2',
      });

      actor1.appendChild(actor2);

      const component = new TestComponent({ testField: 'testFieldValue2' });
      actor2.setComponent(component);

      setValue(
        actor1,
        ['children', 'actor-2', 'components', 'TestComponent', 'testField'],
        'updatedValue2',
      );

      expect((actor2.getComponent(TestComponent)).testField).toBe('updatedValue2');
    });

    it('Updates grandchild component value', () => {
      const actor1 = new Actor({
        id: '1',
        name: 'actor-1',
      });
      const actor2 = new Actor({
        id: '2',
        name: 'actor-2',
      });
      const actor3 = new Actor({
        id: '3',
        name: 'actor-3',
      });

      actor1.appendChild(actor2);
      actor2.appendChild(actor3);

      const component = new TestComponent({ testField: 'testFieldValue3' });
      actor3.setComponent(component);

      setValue(
        actor1,
        ['children', 'actor-2', 'children', 'actor-3', 'components', 'TestComponent', 'testField'],
        'updatedValue3',
      );

      expect((actor3.getComponent(TestComponent)).testField).toBe('updatedValue3');
    });

    it('Throws error if path is incorrect', () => {
      const actor1 = new Actor({
        id: '1',
        name: 'actor-1',
      });
      const actor2 = new Actor({
        id: '2',
        name: 'actor-2',
      });
      const actor3 = new Actor({
        id: '3',
        name: 'actor-3',
      });

      actor1.appendChild(actor2);
      actor2.appendChild(actor3);

      const component = new TestComponent({ testField: 'testFieldValue' });
      actor3.setComponent(component);

      expect(() => {
        setValue(
          actor1,
          ['children', 'notExistActor', 'children', 'actor-3', 'components', 'TestComponent', 'testField'],
          'updatedValue',
        );
      }).toThrowError();
      expect(() => {
        setValue(
          actor1,
          ['children', 'actor-2', 'children', 'notExistActor', 'components', 'TestComponent', 'testField'],
          'updatedValue',
        );
      }).toThrowError();
      expect(() => {
        setValue(
          actor1,
          ['children', 'actor-2', 'children', 'actor-3', 'components', 'NotExistComponent', 'testField'],
          'updatedValue',
        );
      }).toThrowError();
    });
  });
});
