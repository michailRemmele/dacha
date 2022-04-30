import { findParentComponent } from '../component';
import { GameObject } from '../../game-object';
import { createMockComponent } from '../../../__mocks__';

describe('Engine -> Component -> findParentComponent()', () => {
  it('Returns nothing for game object without parent', () => {
    const mockComponentName = 'mock-component';

    const gameObject = new GameObject({ id: '0', name: 'mock-gameObject' });

    gameObject.setComponent(mockComponentName, createMockComponent(mockComponentName));

    expect(findParentComponent(gameObject, mockComponentName)).toEqual(void 0);
  });

  it('Returns parent component for game object with parent', () => {
    const mockComponentName = 'mock-component';

    const gameObject = new GameObject({ id: '1', name: 'mock-gameObject-1' });
    const mockComponent = createMockComponent(mockComponentName);
    gameObject.setComponent(mockComponentName, mockComponent);

    const parentGameObject = new GameObject({ id: '2', name: 'mock-gameObject-2' });
    const mockParentComponent = createMockComponent(mockComponentName);
    parentGameObject.setComponent(mockComponentName, mockParentComponent);

    parentGameObject.appendChild(gameObject);

    expect(findParentComponent(gameObject, mockComponentName)).toEqual(mockParentComponent);
    expect(findParentComponent(gameObject, mockComponentName)).not.toEqual(mockComponent);
  });

  it('Returns parent component for game object with grandparent which have this component', () => {
    const mockComponentName = 'mock-component';

    const gameObject = new GameObject({ id: '1', name: 'mock-gameObject-1' });
    const mockComponent = createMockComponent(mockComponentName);
    gameObject.setComponent(mockComponentName, mockComponent);

    const parentGameObject = new GameObject({ id: '2', name: 'mock-gameObject-2' });

    const grandparentGameObject = new GameObject({ id: '3', name: 'mock-gameObject-3' });
    const mockGrandparentComponent = createMockComponent(mockComponentName);
    grandparentGameObject.setComponent(mockComponentName, mockGrandparentComponent);

    parentGameObject.appendChild(gameObject);
    grandparentGameObject.appendChild(parentGameObject);

    expect(findParentComponent(gameObject, mockComponentName)).toEqual(mockGrandparentComponent);
    expect(findParentComponent(gameObject, mockComponentName)).not.toEqual(mockComponent);
  });

  it('Returns parent component of first parent game object with that component', () => {
    const mockComponentName = 'mock-component';

    const gameObject = new GameObject({ id: '1', name: 'mock-gameObject-1' });
    const mockComponent = createMockComponent(mockComponentName);
    gameObject.setComponent(mockComponentName, mockComponent);

    const parentGameObject = new GameObject({ id: '2', name: 'mock-gameObject-2' });
    const mockParentComponent = createMockComponent(mockComponentName);
    parentGameObject.setComponent(mockComponentName, mockParentComponent);

    const grandparentGameObject = new GameObject({ id: '3', name: 'mock-gameObject-3' });
    const mockGrandparentComponent = createMockComponent(mockComponentName);
    grandparentGameObject.setComponent(mockComponentName, mockGrandparentComponent);

    parentGameObject.appendChild(gameObject);
    grandparentGameObject.appendChild(parentGameObject);

    expect(findParentComponent(gameObject, mockComponentName)).toEqual(mockParentComponent);
    expect(findParentComponent(gameObject, mockComponentName)).not.toEqual(mockComponent);
    expect(findParentComponent(gameObject, mockComponentName)).not.toEqual(
      mockGrandparentComponent,
    );
  });
});
