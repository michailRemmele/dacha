import { findParentComponent, Component } from '../component';
import { Actor } from '../../actor';

class MockComponent extends Component {
  static componentName = 'MockComponent';

  clone(): Component {
    return new MockComponent();
  }
}

describe('Engine -> Component -> findParentComponent()', () => {
  it('Returns nothing for actor without parent', () => {
    const actor = new Actor({ id: '0', name: 'mock-actor' });

    actor.setComponent(new MockComponent());

    expect(findParentComponent(actor, MockComponent)).toEqual(void 0);
  });

  it('Returns parent component for actor with parent', () => {
    const actor = new Actor({ id: '1', name: 'mock-actor-1' });
    const mockComponent = new MockComponent();
    actor.setComponent(mockComponent);

    const parentActor = new Actor({ id: '2', name: 'mock-actor-2' });
    const mockParentComponent = new MockComponent();
    parentActor.setComponent(mockParentComponent);

    parentActor.appendChild(actor);

    expect(findParentComponent(actor, MockComponent)).toEqual(mockParentComponent);
    expect(findParentComponent(actor, MockComponent)).not.toEqual(mockComponent);
  });

  it('Returns parent component for actor with grandparent which have this component', () => {
    const actor = new Actor({ id: '1', name: 'mock-actor-1' });
    const mockComponent = new MockComponent();
    actor.setComponent(mockComponent);

    const parentActor = new Actor({ id: '2', name: 'mock-actor-2' });

    const grandparentActor = new Actor({ id: '3', name: 'mock-actor-3' });
    const mockGrandparentComponent = new MockComponent();
    grandparentActor.setComponent(mockGrandparentComponent);

    parentActor.appendChild(actor);
    grandparentActor.appendChild(parentActor);

    expect(findParentComponent(actor, MockComponent)).toEqual(mockGrandparentComponent);
    expect(findParentComponent(actor, MockComponent)).not.toEqual(mockComponent);
  });

  it('Returns parent component of first parent actor with that component', () => {
    const actor = new Actor({ id: '1', name: 'mock-actor-1' });
    const mockComponent = new MockComponent();
    actor.setComponent(mockComponent);

    const parentActor = new Actor({ id: '2', name: 'mock-actor-2' });
    const mockParentComponent = new MockComponent();
    parentActor.setComponent(mockParentComponent);

    const grandparentActor = new Actor({ id: '3', name: 'mock-actor-3' });
    const mockGrandparentComponent = new MockComponent();
    grandparentActor.setComponent(mockGrandparentComponent);

    parentActor.appendChild(actor);
    grandparentActor.appendChild(parentActor);

    expect(findParentComponent(actor, MockComponent)).toEqual(mockParentComponent);
    expect(findParentComponent(actor, MockComponent)).not.toEqual(mockComponent);
    expect(findParentComponent(actor, MockComponent)).not.toEqual(
      mockGrandparentComponent,
    );
  });
});
