import type { Component } from '../../../../engine/component';
import { Entity } from '../../../../engine/entity/entity';
import { createMockComponent } from '../../../../__mocks__';
import { getValue, setValue } from '../utils';

interface TestComponent extends Component {
  testField: string
}

describe('Contrib -> Animator -> utils', () => {
  describe('getValue()', () => {
    it('Returns entity component value', () => {
      const entity = new Entity({
        id: '1',
        name: 'entity-1',
      });

      const component = createMockComponent('test-1') as TestComponent;
      component.testField = 'testFieldValue';
      entity.setComponent('test-1', component);

      expect(getValue(entity, ['components', 'test-1', 'testField'])).toBe('testFieldValue');
      expect(getValue(entity, ['components', 'test-1', 'notExistField'])).toBeUndefined();
    });

    it('Returns child component value', () => {
      const entity1 = new Entity({
        id: '1',
        name: 'entity-1',
      });
      const entity2 = new Entity({
        id: '2',
        name: 'entity-2',
      });

      entity1.appendChild(entity2);

      const component = createMockComponent('test-2') as TestComponent;
      component.testField = 'testFieldValue2';
      entity2.setComponent('test-2', component);

      expect(
        getValue(
          entity1,
          ['children', 'entity-2', 'components', 'test-2', 'testField'],
        ),
      ).toBe('testFieldValue2');
      expect(
        getValue(
          entity1,
          ['children', 'entity-2', 'components', 'notExistComponent', 'testField'],
        ),
      ).toBeUndefined();
    });

    it('Returns grandchild component value', () => {
      const entity1 = new Entity({
        id: '1',
        name: 'entity-1',
      });
      const entity2 = new Entity({
        id: '2',
        name: 'entity-2',
      });
      const entity3 = new Entity({
        id: '3',
        name: 'entity-3',
      });

      entity1.appendChild(entity2);
      entity2.appendChild(entity3);

      const component = createMockComponent('test-3') as TestComponent;
      component.testField = 'testFieldValue3';
      entity3.setComponent('test-3', component);

      expect(
        getValue(
          entity1,
          ['children', 'entity-2', 'children', 'entity-3', 'components', 'test-3', 'testField'],
        ),
      ).toBe('testFieldValue3');
      expect(
        getValue(
          entity1,
          ['children', 'entity-2', 'children', 'notExistEntity', 'components', 'test-3', 'testField'],
        ),
      ).toBeUndefined();
    });
  });

  describe('setValue()', () => {
    it('Updates entity component value', () => {
      const entity = new Entity({
        id: '1',
        name: 'entity-1',
      });

      const component = createMockComponent('test-1') as TestComponent;
      component.testField = 'testFieldValue';
      entity.setComponent('test-1', component);

      setValue(entity, ['components', 'test-1', 'testField'], 'updatedValue');

      expect((entity.getComponent('test-1') as TestComponent).testField).toBe('updatedValue');
    });

    it('Updates child component value', () => {
      const entity1 = new Entity({
        id: '1',
        name: 'entity-1',
      });
      const entity2 = new Entity({
        id: '2',
        name: 'entity-2',
      });

      entity1.appendChild(entity2);

      const component = createMockComponent('test-2') as TestComponent;
      component.testField = 'testFieldValue2';
      entity2.setComponent('test-2', component);

      setValue(
        entity1,
        ['children', 'entity-2', 'components', 'test-2', 'testField'],
        'updatedValue2',
      );

      expect((entity2.getComponent('test-2') as TestComponent).testField).toBe('updatedValue2');
    });

    it('Updates grandchild component value', () => {
      const entity1 = new Entity({
        id: '1',
        name: 'entity-1',
      });
      const entity2 = new Entity({
        id: '2',
        name: 'entity-2',
      });
      const entity3 = new Entity({
        id: '3',
        name: 'entity-3',
      });

      entity1.appendChild(entity2);
      entity2.appendChild(entity3);

      const component = createMockComponent('test-3') as TestComponent;
      component.testField = 'testFieldValue3';
      entity3.setComponent('test-3', component);

      setValue(
        entity1,
        ['children', 'entity-2', 'children', 'entity-3', 'components', 'test-3', 'testField'],
        'updatedValue3',
      );

      expect((entity3.getComponent('test-3') as TestComponent).testField).toBe('updatedValue3');
    });

    it('Throws error if path is incorrect', () => {
      const entity1 = new Entity({
        id: '1',
        name: 'entity-1',
      });
      const entity2 = new Entity({
        id: '2',
        name: 'entity-2',
      });
      const entity3 = new Entity({
        id: '3',
        name: 'entity-3',
      });

      entity1.appendChild(entity2);
      entity2.appendChild(entity3);

      const component = createMockComponent('test-3') as TestComponent;
      component.testField = 'testFieldValue';
      entity3.setComponent('test-3', component);

      expect(() => {
        setValue(
          entity1,
          ['children', 'notExistEntity', 'children', 'entity-3', 'components', 'test-3', 'testField'],
          'updatedValue',
        );
      }).toThrowError();
      expect(() => {
        setValue(
          entity1,
          ['children', 'entity-2', 'children', 'notExistEntity', 'components', 'test-3', 'testField'],
          'updatedValue',
        );
      }).toThrowError();
      expect(() => {
        setValue(
          entity1,
          ['children', 'entity-2', 'children', 'entity-3', 'components', 'notExistComponent', 'testField'],
          'updatedValue',
        );
      }).toThrowError();
    });
  });
});
