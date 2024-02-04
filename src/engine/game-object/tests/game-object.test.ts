/* comment: mock classes for test */
/* eslint-disable max-classes-per-file */
import { GameObject } from '../game-object';
import { Component } from '../../component';
import { AddComponent, RemoveComponent } from '../../events';
import type { AddComponentEvent, RemoveComponentEvent } from '../../events';

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

describe('Engine -> GameObject', () => {
  it('Returns correct id and name', () => {
    const gameObject1 = new GameObject({
      id: '1',
      name: 'game-object-1',
    });
    const gameObject2 = new GameObject({
      id: '2',
      name: 'game-object-2',
    });

    expect(gameObject1.getId()).toEqual('1');
    expect(gameObject2.getId()).toEqual('2');
    expect(gameObject1.name).toEqual('game-object-1');
    expect(gameObject2.name).toEqual('game-object-2');
  });

  it('Returns correct list of component names', () => {
    const gameObject = new GameObject({
      id: '0',
      name: 'gameObject',
    });
    const component1 = new TestComponent1();
    const component2 = new TestComponent2();

    gameObject.setComponent(component1);
    gameObject.setComponent(component2);

    expect(gameObject.getComponents()).toStrictEqual([
      component1,
      component2,
    ]);
    expect(gameObject.getComponent(TestComponent1)).toEqual(component1);
    expect(gameObject.getComponent(TestComponent2)).toEqual(component2);
  });

  it('Returns correct list of component names after deletion one', () => {
    const gameObject = new GameObject({
      id: '0',
      name: 'gameObject',
    });
    const component1 = new TestComponent1();
    const component2 = new TestComponent2();

    gameObject.setComponent(component1);
    gameObject.setComponent(component2);

    gameObject.removeComponent(TestComponent2);

    expect(gameObject.getComponents()).toStrictEqual([
      component1,
    ]);
    expect(gameObject.getComponent(TestComponent2)).toBeUndefined();
  });

  it('Returns correct ancestor', () => {
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

    gameObject3.appendChild(gameObject2);
    gameObject2.appendChild(gameObject1);

    expect(gameObject1.getAncestor()).toEqual(gameObject3);
    expect(gameObject2.getAncestor()).toEqual(gameObject3);
    expect(gameObject3.getAncestor()).toEqual(gameObject3);
  });

  it('Returns correct ancestor after deletion relations', () => {
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

    gameObject3.appendChild(gameObject2);
    gameObject2.appendChild(gameObject1);

    gameObject3.removeChild(gameObject2);

    expect(gameObject1.getAncestor()).toEqual(gameObject2);
    expect(gameObject2.getAncestor()).toEqual(gameObject2);
    expect(gameObject3.getAncestor()).toEqual(gameObject3);
  });

  it('Calls all subscription callbacks on component add/remove', () => {
    const gameObject = new GameObject({
      id: '0',
      name: 'gameObject',
    });
    const subscription1 = jest.fn() as jest.Mock<void, [AddComponentEvent]>;
    const subscription2 = jest.fn() as jest.Mock<void, [AddComponentEvent]>;
    const subscription3 = jest.fn() as jest.Mock<void, [RemoveComponentEvent]>;

    gameObject.addEventListener(AddComponent, subscription1);
    gameObject.addEventListener(RemoveComponent, subscription3);
    gameObject.setComponent(new TestComponent1());

    gameObject.addEventListener(AddComponent, subscription2);
    gameObject.setComponent(new TestComponent2());

    gameObject.removeComponent(TestComponent1);

    expect(subscription1.mock.calls.length).toEqual(2);
    expect(subscription2.mock.calls.length).toEqual(1);

    expect(subscription1.mock.calls[0][0]).toStrictEqual({
      type: AddComponent,
      componentName: 'TestComponent1',
      target: gameObject,
    });
    expect(subscription1.mock.calls[1][0]).toStrictEqual({
      type: AddComponent,
      componentName: 'TestComponent2',
      target: gameObject,
    });
    expect(subscription3.mock.calls[0][0]).toStrictEqual({
      type: RemoveComponent,
      componentName: 'TestComponent1',
      target: gameObject,
    });

    expect(subscription2.mock.calls[0][0]).toStrictEqual({
      type: AddComponent,
      componentName: 'TestComponent2',
      target: gameObject,
    });
  });

  it('Correct cleans subscriptions', () => {
    const gameObject = new GameObject({
      id: '0',
      name: 'gameObject',
    });
    const subscription1 = jest.fn() as jest.Mock<void, [AddComponentEvent]>;

    gameObject.addEventListener(AddComponent, subscription1);

    gameObject.setComponent(new TestComponent1());

    gameObject.removeAllListeners();

    gameObject.setComponent(new TestComponent2());
    gameObject.removeComponent(TestComponent1);

    expect(subscription1.mock.calls.length).toEqual(1);
  });

  it('Returns added game object as child by id', () => {
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

    gameObject3.appendChild(gameObject2);
    gameObject2.appendChild(gameObject1);

    expect(gameObject3.getChildById('2')).toEqual(gameObject2);
    expect(gameObject3.getChildById('1')).toBeUndefined();
    expect(gameObject2.getChildById('1')).toEqual(gameObject1);

    gameObject3.removeChild(gameObject2);

    expect(gameObject3.getChildById('2')).toBeUndefined();
  });

  it('Returns added game object as child by name', () => {
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

    gameObject3.appendChild(gameObject2);
    gameObject2.appendChild(gameObject1);

    expect(gameObject3.getChildrenByName('game-object-2')).toEqual([gameObject2]);
    expect(gameObject3.getChildrenByName('game-object-1')).toEqual([]);
    expect(gameObject2.getChildrenByName('game-object-1')).toEqual([gameObject1]);

    gameObject3.removeChild(gameObject2);

    expect(gameObject3.getChildrenByName('game-object-2')).toEqual([]);
  });

  it('Returns multiple game objects if there are few of them with same name', () => {
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
      name: 'game-object-2',
    });

    gameObject1.appendChild(gameObject2);
    gameObject1.appendChild(gameObject3);

    expect(gameObject1.getChildrenByName('game-object-2')).toEqual([gameObject2, gameObject3]);
  });

  it('Throws error if child with same id already exists', () => {
    const gameObject1 = new GameObject({
      id: '1',
      name: 'game-object-1',
    });
    const gameObject2 = new GameObject({
      id: '2',
      name: 'game-object-2',
    });
    const gameObject3 = new GameObject({
      id: '2',
      name: 'game-object-3',
    });

    gameObject1.appendChild(gameObject2);

    expect(() => {
      gameObject1.appendChild(gameObject3);
    }).toThrowError('Can\'t add child with id: 2. Child with same name already exists');
  });
});
