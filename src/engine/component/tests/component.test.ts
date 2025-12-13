import { findParentComponent, Component } from '../component';
import { Actor } from '../../actor';

class MockComponent extends Component {
  clone(): Component {
    return new MockComponent();
  }
}

MockComponent.componentName = 'MockComponent';

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

    expect(findParentComponent(actor, MockComponent)).toEqual(
      mockParentComponent,
    );
    expect(findParentComponent(actor, MockComponent)).not.toEqual(
      mockComponent,
    );
  });
});
