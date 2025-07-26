import { Actor } from '../actor';
import { Component } from '../../component';
import {
  RemoveChildEntity,
  AddComponent,
  RemoveComponent,
} from '../../events';
import type {
  RemoveChildEntityEvent,
  AddComponentEvent,
  RemoveComponentEvent,
} from '../../events';

class TestComponent1 extends Component {
  static componentName = 'TestComponent1';

  clone(): Component {
    return new TestComponent1();
  }
}

class TestComponent2 extends Component {
  static componentName = 'TestComponent2';

  clone(): Component {
    return new TestComponent2();
  }
}

describe('Engine -> Actor', () => {
  it('Returns correct list of component names', () => {
    const actor = new Actor({
      id: '0',
      name: 'actor',
    });
    const component1 = new TestComponent1();
    const component2 = new TestComponent2();

    actor.setComponent(component1);
    actor.setComponent(component2);

    expect(actor.getComponents()).toStrictEqual([
      component1,
      component2,
    ]);
    expect(actor.getComponent(TestComponent1)).toEqual(component1);
    expect(actor.getComponent(TestComponent2)).toEqual(component2);
  });

  it('Returns correct list of component names after deletion one', () => {
    const actor = new Actor({
      id: '0',
      name: 'actor',
    });
    const component1 = new TestComponent1();
    const component2 = new TestComponent2();

    actor.setComponent(component1);
    actor.setComponent(component2);

    actor.removeComponent(TestComponent2);

    expect(actor.getComponents()).toStrictEqual([
      component1,
    ]);
    expect(actor.getComponent(TestComponent2)).toBeUndefined();
  });

  it('Calls all subscription callbacks on component add/remove', () => {
    const actor = new Actor({
      id: '0',
      name: 'actor',
    });
    const subscription1 = jest.fn() as jest.Mock<void, [AddComponentEvent]>;
    const subscription2 = jest.fn() as jest.Mock<void, [AddComponentEvent]>;
    const subscription3 = jest.fn() as jest.Mock<void, [RemoveComponentEvent]>;

    actor.addEventListener(AddComponent, subscription1);
    actor.addEventListener(RemoveComponent, subscription3);
    actor.setComponent(new TestComponent1());

    actor.addEventListener(AddComponent, subscription2);
    actor.setComponent(new TestComponent2());

    actor.removeComponent(TestComponent1);

    expect(subscription1.mock.calls.length).toEqual(2);
    expect(subscription2.mock.calls.length).toEqual(1);

    expect(subscription1.mock.calls[0][0]).toMatchObject({
      type: AddComponent,
      componentName: 'TestComponent1',
      target: actor,
    });
    expect(subscription1.mock.calls[1][0]).toMatchObject({
      type: AddComponent,
      componentName: 'TestComponent2',
      target: actor,
    });
    expect(subscription3.mock.calls[0][0]).toMatchObject({
      type: RemoveComponent,
      componentName: 'TestComponent1',
      target: actor,
    });

    expect(subscription2.mock.calls[0][0]).toMatchObject({
      type: AddComponent,
      componentName: 'TestComponent2',
      target: actor,
    });
  });

  it('Correct cleans subscriptions', () => {
    const actor = new Actor({
      id: '0',
      name: 'actor',
    });
    const subscription1 = jest.fn() as jest.Mock<void, [AddComponentEvent]>;

    actor.addEventListener(AddComponent, subscription1);

    actor.setComponent(new TestComponent1());

    actor.removeAllListeners();

    actor.setComponent(new TestComponent2());
    actor.removeComponent(TestComponent1);

    expect(subscription1.mock.calls.length).toEqual(1);
  });

  it('Removes child from parent with notification', () => {
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

    const listener = jest.fn() as jest.Mock<void, [RemoveChildEntityEvent]>;
    actor1.addEventListener(RemoveChildEntity, listener);

    actor1.appendChild(actor2);
    actor2.appendChild(actor3);

    actor3.remove();

    expect(listener.mock.calls.length).toEqual(1);
    expect(listener.mock.calls[0][0]).toMatchObject({
      type: RemoveChildEntity,
      target: actor2,
      child: actor3,
    });

    expect(actor1.findChildById('actor-3')).toBeUndefined();
  });
});
