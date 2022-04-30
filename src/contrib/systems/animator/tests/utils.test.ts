import type { Component } from '../../../../engine/component';
import { GameObject } from '../../../../engine/game-object/game-object';
import { createMockComponent } from '../../../../__mocks__';
import { getValue, setValue } from '../utils';

interface TestComponent extends Component {
  testField: string
}

describe('Contrib -> Animator -> utils', () => {
  describe('getValue()', () => {
    it('Returns gameObject component value', () => {
      const gameObject = new GameObject({
        id: '1',
        name: 'game-object-1',
      });

      const component = createMockComponent('test-1') as TestComponent;
      component.testField = 'testFieldValue';
      gameObject.setComponent('test-1', component);

      expect(getValue(gameObject, ['components', 'test-1', 'testField'])).toBe('testFieldValue');
      expect(getValue(gameObject, ['components', 'test-1', 'notExistField'])).toBeUndefined();
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

      const component = createMockComponent('test-2') as TestComponent;
      component.testField = 'testFieldValue2';
      gameObject2.setComponent('test-2', component);

      expect(
        getValue(
          gameObject1,
          ['children', 'game-object-2', 'components', 'test-2', 'testField'],
        ),
      ).toBe('testFieldValue2');
      expect(
        getValue(
          gameObject1,
          ['children', 'game-object-2', 'components', 'notExistComponent', 'testField'],
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

      const component = createMockComponent('test-3') as TestComponent;
      component.testField = 'testFieldValue3';
      gameObject3.setComponent('test-3', component);

      expect(
        getValue(
          gameObject1,
          ['children', 'game-object-2', 'children', 'game-object-3', 'components', 'test-3', 'testField'],
        ),
      ).toBe('testFieldValue3');
      expect(
        getValue(
          gameObject1,
          ['children', 'game-object-2', 'children', 'notExistGameObject', 'components', 'test-3', 'testField'],
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

      const component = createMockComponent('test-1') as TestComponent;
      component.testField = 'testFieldValue';
      gameObject.setComponent('test-1', component);

      setValue(gameObject, ['components', 'test-1', 'testField'], 'updatedValue');

      expect((gameObject.getComponent('test-1') as TestComponent).testField).toBe('updatedValue');
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

      const component = createMockComponent('test-2') as TestComponent;
      component.testField = 'testFieldValue2';
      gameObject2.setComponent('test-2', component);

      setValue(
        gameObject1,
        ['children', 'game-object-2', 'components', 'test-2', 'testField'],
        'updatedValue2',
      );

      expect((gameObject2.getComponent('test-2') as TestComponent).testField).toBe('updatedValue2');
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

      const component = createMockComponent('test-3') as TestComponent;
      component.testField = 'testFieldValue3';
      gameObject3.setComponent('test-3', component);

      setValue(
        gameObject1,
        ['children', 'game-object-2', 'children', 'game-object-3', 'components', 'test-3', 'testField'],
        'updatedValue3',
      );

      expect((gameObject3.getComponent('test-3') as TestComponent).testField).toBe('updatedValue3');
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

      const component = createMockComponent('test-3') as TestComponent;
      component.testField = 'testFieldValue';
      gameObject3.setComponent('test-3', component);

      expect(() => {
        setValue(
          gameObject1,
          ['children', 'notExistGameObject', 'children', 'game-object-3', 'components', 'test-3', 'testField'],
          'updatedValue',
        );
      }).toThrowError();
      expect(() => {
        setValue(
          gameObject1,
          ['children', 'game-object-2', 'children', 'notExistGameObject', 'components', 'test-3', 'testField'],
          'updatedValue',
        );
      }).toThrowError();
      expect(() => {
        setValue(
          gameObject1,
          ['children', 'game-object-2', 'children', 'game-object-3', 'components', 'notExistComponent', 'testField'],
          'updatedValue',
        );
      }).toThrowError();
    });
  });
});
