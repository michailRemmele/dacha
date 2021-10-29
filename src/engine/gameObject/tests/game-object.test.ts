import { GameObject, ComponentsEditionEvent } from '../game-object';
import { createMockComponent } from '../../../__mocks__';

describe('Engine -> GameObject()', () => {
  it('Returns correct id', () => {
    const gameObject1 = new GameObject('game-object-1');
    const gameObject2 = new GameObject('game-object-2');

    expect(gameObject1.getId()).toEqual('game-object-1');
    expect(gameObject2.getId()).toEqual('game-object-2');
  });

  it('Returns correct type', () => {
    const gameObject1 = new GameObject('game-object-1');
    const gameObject2 = new GameObject('game-object-2');
    gameObject1.setType('some-type-1');
    gameObject2.setType('some-type-2');

    expect(gameObject1.getType()).toEqual('some-type-1');
    expect(gameObject2.getType()).toEqual('some-type-2');
  });

  it('Returns correct list of component names', () => {
    const gameObject = new GameObject('game-object');
    const component1 = createMockComponent('component-1');
    const component2 = createMockComponent('component-2');

    gameObject.setComponent('component-1', component1);
    gameObject.setComponent('component-2', component2);

    expect(gameObject.getComponentNamesList()).toStrictEqual([
      'component-1',
      'component-2',
    ]);
    expect(gameObject.getComponent('component-1')).toEqual(component1);
    expect(gameObject.getComponent('component-2')).toEqual(component2);
  });

  it('Returns correct list of component names after deletion one', () => {
    const gameObject = new GameObject('game-object');
    const component1 = createMockComponent('component-1');
    const component2 = createMockComponent('component-2');

    gameObject.setComponent('component-1', component1);
    gameObject.setComponent('component-2', component2);

    gameObject.removeComponent('component-2');

    expect(gameObject.getComponentNamesList()).toStrictEqual([
      'component-1',
    ]);
    expect(gameObject.getComponent('component-2')).toBeUndefined();
  });

  it('Returns correct ancestor', () => {
    const gameObject1 = new GameObject('game-object-1');
    const gameObject2 = new GameObject('game-object-2');
    const gameObject3 = new GameObject('game-object-3');

    gameObject3.appendChild(gameObject2);
    gameObject2.appendChild(gameObject1);

    expect(gameObject1.getAncestor()).toEqual(gameObject3);
    expect(gameObject2.getAncestor()).toEqual(gameObject3);
    expect(gameObject3.getAncestor()).toEqual(gameObject3);
  });

  it('Returns correct ancestor after deletion relations', () => {
    const gameObject1 = new GameObject('game-object-1');
    const gameObject2 = new GameObject('game-object-2');
    const gameObject3 = new GameObject('game-object-3');

    gameObject3.appendChild(gameObject2);
    gameObject2.appendChild(gameObject1);

    gameObject3.removeChild(gameObject2);

    expect(gameObject1.getAncestor()).toEqual(gameObject2);
    expect(gameObject2.getAncestor()).toEqual(gameObject2);
    expect(gameObject3.getAncestor()).toEqual(gameObject3);
  });

  it('Calls all subscription callbacks on component add/remove', () => {
    const gameObject = new GameObject('game-object');
    const subscription1 = jest.fn() as jest.Mock<void, [ComponentsEditionEvent]>;
    const wrappedSubscription1 = (event: ComponentsEditionEvent) => { subscription1(event); };
    const subscription2 = jest.fn() as jest.Mock<void, [ComponentsEditionEvent]>;
    const wrappedSubscription2 = (event: ComponentsEditionEvent) => { subscription2(event); };

    gameObject.subscribe(wrappedSubscription1);
    gameObject.setComponent('component-1', createMockComponent('component-1'));

    gameObject.subscribe(wrappedSubscription2);
    gameObject.setComponent('component-2', createMockComponent('component-2'));

    gameObject.removeComponent('component-1');

    expect(subscription1.mock.calls.length).toEqual(3);
    expect(subscription2.mock.calls.length).toEqual(2);

    expect(subscription1.mock.calls[0][0]).toStrictEqual({
      type: 'COMPONENT_ADDED',
      componentName: 'component-1',
      gameObject,
    });
    expect(subscription1.mock.calls[1][0]).toStrictEqual({
      type: 'COMPONENT_ADDED',
      componentName: 'component-2',
      gameObject,
    });
    expect(subscription1.mock.calls[2][0]).toStrictEqual({
      type: 'COMPONENT_REMOVED',
      componentName: 'component-1',
      gameObject,
    });

    expect(subscription2.mock.calls[0][0]).toStrictEqual({
      type: 'COMPONENT_ADDED',
      componentName: 'component-2',
      gameObject,
    });
    expect(subscription2.mock.calls[1][0]).toStrictEqual({
      type: 'COMPONENT_REMOVED',
      componentName: 'component-1',
      gameObject,
    });
  });

  it('Correct cleans subscriptions', () => {
    const gameObject = new GameObject('game-object');
    const subscription1 = jest.fn() as jest.Mock<void, [ComponentsEditionEvent]>;
    const wrappedSubscription1 = (event: ComponentsEditionEvent) => { subscription1(event); };

    gameObject.subscribe(wrappedSubscription1);

    gameObject.setComponent('component-1', createMockComponent('component-1'));

    gameObject.clearSubscriptions();

    gameObject.setComponent('component-2', createMockComponent('component-2'));
    gameObject.removeComponent('component-1');

    expect(subscription1.mock.calls.length).toEqual(1);
  });
});
