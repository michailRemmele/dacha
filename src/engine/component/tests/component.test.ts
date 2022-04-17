import { findParentComponent } from '../component';
import { Entity } from '../../entity';
import { createMockComponent } from '../../../__mocks__';

describe('Engine -> Component -> findParentComponent()', () => {
  it('Returns nothing for game object without parent', () => {
    const mockComponentName = 'mock-component';

    const entity = new Entity({ id: '0', name: 'mock-entity' });

    entity.setComponent(mockComponentName, createMockComponent(mockComponentName));

    expect(findParentComponent(entity, mockComponentName)).toEqual(void 0);
  });

  it('Returns parent component for game object with parent', () => {
    const mockComponentName = 'mock-component';

    const entity = new Entity({ id: '1', name: 'mock-entity-1' });
    const mockComponent = createMockComponent(mockComponentName);
    entity.setComponent(mockComponentName, mockComponent);

    const parentEntity = new Entity({ id: '2', name: 'mock-entity-2' });
    const mockParentComponent = createMockComponent(mockComponentName);
    parentEntity.setComponent(mockComponentName, mockParentComponent);

    parentEntity.appendChild(entity);

    expect(findParentComponent(entity, mockComponentName)).toEqual(mockParentComponent);
    expect(findParentComponent(entity, mockComponentName)).not.toEqual(mockComponent);
  });

  it('Returns parent component for game object with grandparent which have this component', () => {
    const mockComponentName = 'mock-component';

    const entity = new Entity({ id: '1', name: 'mock-entity-1' });
    const mockComponent = createMockComponent(mockComponentName);
    entity.setComponent(mockComponentName, mockComponent);

    const parentEntity = new Entity({ id: '2', name: 'mock-entity-2' });

    const grandparentEntity = new Entity({ id: '3', name: 'mock-entity-3' });
    const mockGrandparentComponent = createMockComponent(mockComponentName);
    grandparentEntity.setComponent(mockComponentName, mockGrandparentComponent);

    parentEntity.appendChild(entity);
    grandparentEntity.appendChild(parentEntity);

    expect(findParentComponent(entity, mockComponentName)).toEqual(mockGrandparentComponent);
    expect(findParentComponent(entity, mockComponentName)).not.toEqual(mockComponent);
  });

  it('Returns parent component of first parent game object with that component', () => {
    const mockComponentName = 'mock-component';

    const entity = new Entity({ id: '1', name: 'mock-entity-1' });
    const mockComponent = createMockComponent(mockComponentName);
    entity.setComponent(mockComponentName, mockComponent);

    const parentEntity = new Entity({ id: '2', name: 'mock-entity-2' });
    const mockParentComponent = createMockComponent(mockComponentName);
    parentEntity.setComponent(mockComponentName, mockParentComponent);

    const grandparentEntity = new Entity({ id: '3', name: 'mock-entity-3' });
    const mockGrandparentComponent = createMockComponent(mockComponentName);
    grandparentEntity.setComponent(mockComponentName, mockGrandparentComponent);

    parentEntity.appendChild(entity);
    grandparentEntity.appendChild(parentEntity);

    expect(findParentComponent(entity, mockComponentName)).toEqual(mockParentComponent);
    expect(findParentComponent(entity, mockComponentName)).not.toEqual(mockComponent);
    expect(findParentComponent(entity, mockComponentName)).not.toEqual(
      mockGrandparentComponent,
    );
  });
});
