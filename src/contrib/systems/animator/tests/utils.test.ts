import { Component } from '../../../../engine/component';
import { GameObject } from '../../../../engine/game-object/game-object';
import { getValue, setValue } from '../utils';

interface TestComponentConfig extends Record<string, unknown> {
  testField: string
}

class TestComponent extends Component {
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
    it('Returns gameObject component value', () => {
      const gameObject = new GameObject({
        id: '1',
        name: 'game-object-1',
      });

      const component = new TestComponent({ testField: 'testFieldValue' });
      gameObject.setComponent(component);

      expect(getValue(gameObject, ['components', 'TestComponent', 'testField'])).toBe('testFieldValue');
      expect(getValue(gameObject, ['components', 'TestComponent', 'notExistField'])).toBeUndefined();
    });

    it('Returns child component value', () => {
      const gameObject1 = new GameObject({
        id: '1',
        name: 'game-object-1',
      });
      const gameObject2 = new GameObject({
        id: '2',
        name: 'game-object-2',
      });

      gameObject1.appendChild(gameObject2);

      const component = new TestComponent({ testField: 'testFieldValue2' });
      gameObject2.setComponent(component);

      expect(
        getValue(
          gameObject1,
          ['children', 'game-object-2', 'components', 'TestComponent', 'testField'],
        ),
      ).toBe('testFieldValue2');
      expect(
        getValue(
          gameObject1,
          ['children', 'game-object-2', 'components', 'NotExistComponent', 'testField'],
        ),
      ).toBeUndefined();
    });

    it('Returns grandchild component value', () => {
      const gameObject1 = new GameObject({
        id: '1',
        name: 'game-object-1',
      });
      const gameObject2 = new GameObject({
        id: '2',
        name: 'game-object-2',
      });
      const gameObject3 = new GameObject({
        id: '3',
        name: 'game-object-3',
      });

      gameObject1.appendChild(gameObject2);
      gameObject2.appendChild(gameObject3);

      const component = new TestComponent({ testField: 'testFieldValue3' });
      gameObject3.setComponent(component);

      expect(
        getValue(
          gameObject1,
          ['children', 'game-object-2', 'children', 'game-object-3', 'components', 'TestComponent', 'testField'],
        ),
      ).toBe('testFieldValue3');
      expect(
        getValue(
          gameObject1,
          ['children', 'game-object-2', 'children', 'notExistGameObject', 'components', 'TestComponent', 'testField'],
        ),
      ).toBeUndefined();
    });
  });

  describe('setValue()', () => {
    it('Updates gameObject component value', () => {
      const gameObject = new GameObject({
        id: '1',
        name: 'game-object-1',
      });

      const component = new TestComponent({ testField: 'testFieldValue' });
      gameObject.setComponent(component);

      setValue(gameObject, ['components', 'TestComponent', 'testField'], 'updatedValue');

      expect((gameObject.getComponent(TestComponent)).testField).toBe('updatedValue');
    });

    it('Updates child component value', () => {
      const gameObject1 = new GameObject({
        id: '1',
        name: 'game-object-1',
      });
      const gameObject2 = new GameObject({
        id: '2',
        name: 'game-object-2',
      });

      gameObject1.appendChild(gameObject2);

      const component = new TestComponent({ testField: 'testFieldValue2' });
      gameObject2.setComponent(component);

      setValue(
        gameObject1,
        ['children', 'game-object-2', 'components', 'TestComponent', 'testField'],
        'updatedValue2',
      );

      expect((gameObject2.getComponent(TestComponent)).testField).toBe('updatedValue2');
    });

    it('Updates grandchild component value', () => {
      const gameObject1 = new GameObject({
        id: '1',
        name: 'game-object-1',
      });
      const gameObject2 = new GameObject({
        id: '2',
        name: 'game-object-2',
      });
      const gameObject3 = new GameObject({
        id: '3',
        name: 'game-object-3',
      });

      gameObject1.appendChild(gameObject2);
      gameObject2.appendChild(gameObject3);

      const component = new TestComponent({ testField: 'testFieldValue3' });
      gameObject3.setComponent(component);

      setValue(
        gameObject1,
        ['children', 'game-object-2', 'children', 'game-object-3', 'components', 'TestComponent', 'testField'],
        'updatedValue3',
      );

      expect((gameObject3.getComponent(TestComponent)).testField).toBe('updatedValue3');
    });

    it('Throws error if path is incorrect', () => {
      const gameObject1 = new GameObject({
        id: '1',
        name: 'game-object-1',
      });
      const gameObject2 = new GameObject({
        id: '2',
        name: 'game-object-2',
      });
      const gameObject3 = new GameObject({
        id: '3',
        name: 'game-object-3',
      });

      gameObject1.appendChild(gameObject2);
      gameObject2.appendChild(gameObject3);

      const component = new TestComponent({ testField: 'testFieldValue' });
      gameObject3.setComponent(component);

      expect(() => {
        setValue(
          gameObject1,
          ['children', 'notExistGameObject', 'children', 'game-object-3', 'components', 'TestComponent', 'testField'],
          'updatedValue',
        );
      }).toThrowError();
      expect(() => {
        setValue(
          gameObject1,
          ['children', 'game-object-2', 'children', 'notExistGameObject', 'components', 'TestComponent', 'testField'],
          'updatedValue',
        );
      }).toThrowError();
      expect(() => {
        setValue(
          gameObject1,
          ['children', 'game-object-2', 'children', 'game-object-3', 'components', 'NotExistComponent', 'testField'],
          'updatedValue',
        );
      }).toThrowError();
    });
  });
});
