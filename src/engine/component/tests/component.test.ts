import { findParentComponent } from '../component';
import { GameObject } from '../../gameObject';
import { createMockComponent } from '../../../__mocks__';

describe('Engine -> Component -> findParentComponent()', () => {
  it('Returns nothing for game object without parent', () => {
    const mockComponentName = 'mock-component';

    const gameObject = new GameObject('mock-game-object');

    gameObject.setComponent(mockComponentName, createMockComponent(mockComponentName));

    expect(findParentComponent(gameObject, mockComponentName)).toEqual(void 0);
  });

  it('Returns parent component for game object with parent', () => {
    const mockComponentName = 'mock-component';

    const gameObject = new GameObject('mock-game-object-1');
    const mockComponent = createMockComponent(mockComponentName);
    gameObject.setComponent(mockComponentName, mockComponent);

    const parentGameObject = new GameObject('mock-game-object-2');
    const mockParentComponent = createMockComponent(mockComponentName);
    parentGameObject.setComponent(mockComponentName, mockParentComponent);

    parentGameObject.appendChild(gameObject);

    expect(findParentComponent(gameObject, mockComponentName)).toEqual(mockParentComponent);
    expect(findParentComponent(gameObject, mockComponentName)).not.toEqual(mockComponent);
  });

  it('Returns parent component for game object with grandparent which have this component', () => {
    const mockComponentName = 'mock-component';

    const gameObject = new GameObject('mock-game-object-1');
    const mockComponent = createMockComponent(mockComponentName);
    gameObject.setComponent(mockComponentName, mockComponent);

    const parentGameObject = new GameObject('mock-game-object-2');

    const grandparentGameObject = new GameObject('mock-game-object-3');
    const mockGrandparentComponent = createMockComponent(mockComponentName);
    grandparentGameObject.setComponent(mockComponentName, mockGrandparentComponent);

    parentGameObject.appendChild(gameObject);
    grandparentGameObject.appendChild(parentGameObject);

    expect(findParentComponent(gameObject, mockComponentName)).toEqual(mockGrandparentComponent);
    expect(findParentComponent(gameObject, mockComponentName)).not.toEqual(mockComponent);
  });

  it('Returns parent component of first parent game object with that component', () => {
    const mockComponentName = 'mock-component';

    const gameObject = new GameObject('mock-game-object-1');
    const mockComponent = createMockComponent(mockComponentName);
    gameObject.setComponent(mockComponentName, mockComponent);

    const parentGameObject = new GameObject('mock-game-object-2');
    const mockParentComponent = createMockComponent(mockComponentName);
    parentGameObject.setComponent(mockComponentName, mockParentComponent);

    const grandparentGameObject = new GameObject('mock-game-object-3');
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
