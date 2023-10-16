import { findParentComponent, Component } from '../component';
import { GameObject } from '../../game-object';

class MockComponent extends Component {
  static componentName = 'MockComponent';

  clone(): Component {
    return new MockComponent();
  }
}

describe('Engine -> Component -> findParentComponent()', () => {
  it('Returns nothing for game object without parent', () => {
    const gameObject = new GameObject({ id: '0', name: 'mock-game-object' });

    gameObject.setComponent(new MockComponent());

    expect(findParentComponent(gameObject, MockComponent)).toEqual(void 0);
  });

  it('Returns parent component for game object with parent', () => {
    const gameObject = new GameObject({ id: '1', name: 'mock-game-object-1' });
    const mockComponent = new MockComponent();
    gameObject.setComponent(mockComponent);

    const parentGameObject = new GameObject({ id: '2', name: 'mock-game-object-2' });
    const mockParentComponent = new MockComponent();
    parentGameObject.setComponent(mockParentComponent);

    parentGameObject.appendChild(gameObject);

    expect(findParentComponent(gameObject, MockComponent)).toEqual(mockParentComponent);
    expect(findParentComponent(gameObject, MockComponent)).not.toEqual(mockComponent);
  });

  it('Returns parent component for game object with grandparent which have this component', () => {
    const gameObject = new GameObject({ id: '1', name: 'mock-game-object-1' });
    const mockComponent = new MockComponent();
    gameObject.setComponent(mockComponent);

    const parentGameObject = new GameObject({ id: '2', name: 'mock-game-object-2' });

    const grandparentGameObject = new GameObject({ id: '3', name: 'mock-game-object-3' });
    const mockGrandparentComponent = new MockComponent();
    grandparentGameObject.setComponent(mockGrandparentComponent);

    parentGameObject.appendChild(gameObject);
    grandparentGameObject.appendChild(parentGameObject);

    expect(findParentComponent(gameObject, MockComponent)).toEqual(mockGrandparentComponent);
    expect(findParentComponent(gameObject, MockComponent)).not.toEqual(mockComponent);
  });

  it('Returns parent component of first parent game object with that component', () => {
    const gameObject = new GameObject({ id: '1', name: 'mock-game-object-1' });
    const mockComponent = new MockComponent();
    gameObject.setComponent(mockComponent);

    const parentGameObject = new GameObject({ id: '2', name: 'mock-game-object-2' });
    const mockParentComponent = new MockComponent();
    parentGameObject.setComponent(mockParentComponent);

    const grandparentGameObject = new GameObject({ id: '3', name: 'mock-game-object-3' });
    const mockGrandparentComponent = new MockComponent();
    grandparentGameObject.setComponent(mockGrandparentComponent);

    parentGameObject.appendChild(gameObject);
    grandparentGameObject.appendChild(parentGameObject);

    expect(findParentComponent(gameObject, MockComponent)).toEqual(mockParentComponent);
    expect(findParentComponent(gameObject, MockComponent)).not.toEqual(mockComponent);
    expect(findParentComponent(gameObject, MockComponent)).not.toEqual(
      mockGrandparentComponent,
    );
  });
});
