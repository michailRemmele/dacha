/* comment: mock classes for test */
/* eslint-disable max-classes-per-file */
import { Scene } from '../../scene';
import { GameObjectObserver } from '../game-object-observer';
import { GameObjectCreator } from '../game-object-creator';
import { GameObject } from '../game-object';
import { TemplateCollection } from '../../template';
import { Component } from '../../component';
import { AddGameObject, RemoveGameObject } from '../../events';

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

class TestComponent3 extends Component {
  static componentName = 'TestComponent3';

  clone(): Component {
    return new TestComponent3();
  }
}

describe('Engine -> GameObjectObserver', () => {
  let scene: Scene;

  let gameObject1: GameObject;
  let gameObject2: GameObject;
  let gameObject3: GameObject;
  let gameObject4: GameObject;
  let gameObject5: GameObject;

  beforeEach(() => {
    const templateCollection = new TemplateCollection([]);
    scene = new Scene({
      id: '000',
      name: 'test-scene',
      gameObjects: [],
      availableSystems: [],
      resources: {},
      globalOptions: {},
      systems: [],
      gameObjectCreator: new GameObjectCreator([], templateCollection),
      templateCollection,
      levelId: null,
    });

    gameObject1 = new GameObject({
      id: '1',
      name: 'game-object-1',
    });
    gameObject2 = new GameObject({
      id: '2',
      name: 'game-object-2',
    });
    gameObject3 = new GameObject({
      id: '3',
      name: 'game-object-3',
    });
    gameObject4 = new GameObject({
      id: '4',
      name: 'game-object-4',
    });
    gameObject5 = new GameObject({
      id: '5',
      name: 'game-object-5',
    });

    gameObject1.setComponent(new TestComponent1());

    gameObject2.setComponent(new TestComponent1());

    gameObject3.setComponent(new TestComponent2());

    gameObject4.setComponent(new TestComponent1());
    gameObject4.setComponent(new TestComponent2());

    gameObject5.setComponent(new TestComponent1());
    gameObject5.setComponent(new TestComponent2());
    gameObject5.setComponent(new TestComponent3());
  });

  it('Correct filters game objects by components', () => {
    const gameObjectObserver = new GameObjectObserver(scene, {
      components: [TestComponent1, TestComponent2],
    });

    scene.appendChild(gameObject1);
    scene.appendChild(gameObject2);
    scene.appendChild(gameObject3);
    scene.appendChild(gameObject4);
    scene.appendChild(gameObject5);

    expect(gameObjectObserver.size).toEqual(2);

    const expectedIds = ['4', '5'];
    gameObjectObserver.forEach((gameObject, index) => {
      expect(gameObject.id).toEqual(expectedIds[index]);
    });
  });

  it('Correct subscribe on new game objects additions', () => {
    const gameObjectObserver = new GameObjectObserver(scene, {
      components: [TestComponent1],
    });
    const testFn1 = jest.fn();
    const testFn2 = jest.fn();

    gameObjectObserver.addEventListener(AddGameObject, testFn1);
    gameObjectObserver.addEventListener(AddGameObject, testFn2);

    scene.appendChild(gameObject1);

    expect(testFn1.mock.calls.length).toEqual(1);
    expect(testFn1.mock.calls[0]).toMatchObject([{
      type: AddGameObject,
      target: gameObjectObserver,
      gameObject: gameObject1,
    }]);
    expect(testFn2.mock.calls.length).toEqual(1);
    expect(testFn2.mock.calls[0]).toMatchObject([{
      type: AddGameObject,
      target: gameObjectObserver,
      gameObject: gameObject1,
    }]);
    expect(gameObjectObserver.size).toEqual(1);

    scene.appendChild(gameObject3);

    expect(testFn1.mock.calls.length).toEqual(1);
    expect(testFn2.mock.calls.length).toEqual(1);
    expect(gameObjectObserver.size).toEqual(1);

    gameObject3.setComponent(new TestComponent1());

    expect(testFn1.mock.calls.length).toEqual(2);
    expect(testFn1.mock.calls[1]).toMatchObject([{
      type: AddGameObject,
      target: gameObjectObserver,
      gameObject: gameObject3,
    }]);
    expect(testFn2.mock.calls.length).toEqual(2);
    expect(testFn2.mock.calls[1]).toMatchObject([{
      type: AddGameObject,
      target: gameObjectObserver,
      gameObject: gameObject3,
    }]);
    expect(gameObjectObserver.size).toEqual(2);

    scene.appendChild(gameObject4);
    scene.appendChild(gameObject5);

    expect(testFn1.mock.calls.length).toEqual(4);
    expect(testFn1.mock.calls[2]).toMatchObject([{
      type: AddGameObject,
      target: gameObjectObserver,
      gameObject: gameObject4,
    }]);
    expect(testFn1.mock.calls[3]).toMatchObject([{
      type: AddGameObject,
      target: gameObjectObserver,
      gameObject: gameObject5,
    }]);
    expect(testFn2.mock.calls.length).toEqual(4);
    expect(testFn2.mock.calls[2]).toMatchObject([{
      type: AddGameObject,
      target: gameObjectObserver,
      gameObject: gameObject4,
    }]);
    expect(testFn2.mock.calls[3]).toMatchObject([{
      type: AddGameObject,
      target: gameObjectObserver,
      gameObject: gameObject5,
    }]);
    expect(gameObjectObserver.size).toEqual(4);
  });

  it('Correct subscribe on new game objects removes', () => {
    const gameObjectObserver = new GameObjectObserver(scene, {
      components: [TestComponent1],
    });

    const testFn1 = jest.fn();
    const testFn2 = jest.fn();

    gameObjectObserver.addEventListener(RemoveGameObject, testFn1);
    gameObjectObserver.addEventListener(RemoveGameObject, testFn2);

    scene.appendChild(gameObject1);
    scene.appendChild(gameObject2);
    scene.appendChild(gameObject3);
    scene.appendChild(gameObject4);
    scene.appendChild(gameObject5);

    expect(testFn1.mock.calls.length).toEqual(0);
    expect(testFn2.mock.calls.length).toEqual(0);
    expect(gameObjectObserver.size).toEqual(4);

    gameObject1.removeComponent(TestComponent1);

    expect(testFn1.mock.calls.length).toEqual(1);
    expect(testFn1.mock.calls[0]).toMatchObject([{
      type: RemoveGameObject,
      target: gameObjectObserver,
      gameObject: gameObject1,
    }]);
    expect(testFn2.mock.calls.length).toEqual(1);
    expect(testFn2.mock.calls[0]).toMatchObject([{
      type: RemoveGameObject,
      target: gameObjectObserver,
      gameObject: gameObject1,
    }]);
    expect(gameObjectObserver.size).toEqual(3);

    scene.removeChild(gameObject3);
    scene.removeChild(gameObject4);
    gameObject5.removeComponent(TestComponent1);

    expect(testFn1.mock.calls.length).toEqual(3);
    expect(testFn1.mock.calls[1]).toMatchObject([{
      type: RemoveGameObject,
      target: gameObjectObserver,
      gameObject: gameObject4,
    }]);
    expect(testFn1.mock.calls[2]).toMatchObject([{
      type: RemoveGameObject,
      target: gameObjectObserver,
      gameObject: gameObject5,
    }]);
    expect(testFn2.mock.calls.length).toEqual(3);
    expect(testFn2.mock.calls[1]).toMatchObject([{
      type: RemoveGameObject,
      target: gameObjectObserver,
      gameObject: gameObject4,
    }]);
    expect(testFn2.mock.calls[2]).toMatchObject([{
      type: RemoveGameObject,
      target: gameObjectObserver,
      gameObject: gameObject5,
    }]);
    expect(gameObjectObserver.size).toEqual(1);
  });

  it('Correct unsubscribe from game object observer events', () => {
    const gameObjectObserver = new GameObjectObserver(scene, {
      components: [TestComponent1],
    });

    const testFn = jest.fn();

    gameObjectObserver.addEventListener(AddGameObject, testFn);

    scene.appendChild(gameObject1);

    expect(testFn.mock.calls.length).toEqual(1);

    gameObjectObserver.removeEventListener(AddGameObject, testFn);

    scene.appendChild(gameObject4);

    expect(testFn.mock.calls.length).toEqual(1);
  });

  it('Correct returns game objects by id and index', () => {
    const gameObjectObserver = new GameObjectObserver(scene, {
      components: [TestComponent1, TestComponent2],
    });

    scene.appendChild(gameObject1);
    scene.appendChild(gameObject2);
    scene.appendChild(gameObject3);
    scene.appendChild(gameObject4);
    scene.appendChild(gameObject5);

    expect(gameObjectObserver.getById('4')).toEqual(gameObject4);
    expect(gameObjectObserver.getById('5')).toEqual(gameObject5);

    expect(gameObjectObserver.getById('1')).toEqual(void 0);
    expect(gameObjectObserver.getById('2')).toEqual(void 0);
    expect(gameObjectObserver.getById('3')).toEqual(void 0);
  });

  it('Correct sorts game objects', () => {
    const gameObjectObserver = new GameObjectObserver(scene, {
      components: [TestComponent1],
    });

    scene.appendChild(gameObject5);
    scene.appendChild(gameObject4);
    scene.appendChild(gameObject2);
    scene.appendChild(gameObject3);
    scene.appendChild(gameObject1);

    const unsortedIds = ['5', '4', '2', '1'];
    gameObjectObserver.forEach((gameObject, index) => {
      expect(gameObject.id).toEqual(unsortedIds[index]);
    });

    gameObjectObserver.sort((a, b) => {
      if (a.id < b.id) { return -1; }
      if (a.id > b.id) { return 1; }
      return 0;
    });

    const sortedIds = ['1', '2', '4', '5'];
    gameObjectObserver.forEach((gameObject, index) => {
      expect(gameObject.id).toEqual(sortedIds[index]);
    });
  });

  it('Correctly adds all incoming child objects', () => {
    scene.appendChild(gameObject1);

    gameObject1.appendChild(gameObject2);
    gameObject1.appendChild(gameObject3);
    gameObject2.appendChild(gameObject4);
    gameObject3.appendChild(gameObject5);

    const gameObjectObserver = new GameObjectObserver(scene, {
      components: [TestComponent1],
    });

    expect(gameObjectObserver.size).toEqual(4);

    expect(gameObjectObserver.getById('1')).toEqual(gameObject1);
    expect(gameObjectObserver.getById('2')).toEqual(gameObject2);
    expect(gameObjectObserver.getById('3')).toBeUndefined();
    expect(gameObjectObserver.getById('4')).toEqual(gameObject4);
    expect(gameObjectObserver.getById('5')).toEqual(gameObject5);
  });

  it('Correctly adds all incoming child objects', () => {
    const gameObjectObserver = new GameObjectObserver(scene, {
      components: [TestComponent1],
    });

    scene.appendChild(gameObject1);

    gameObject1.appendChild(gameObject2);
    gameObject1.appendChild(gameObject3);
    gameObject2.appendChild(gameObject4);
    gameObject3.appendChild(gameObject5);

    expect(gameObjectObserver.size).toEqual(4);

    expect(gameObjectObserver.getById('1')).toEqual(gameObject1);
    expect(gameObjectObserver.getById('2')).toEqual(gameObject2);
    expect(gameObjectObserver.getById('3')).toBeUndefined();
    expect(gameObjectObserver.getById('4')).toEqual(gameObject4);
    expect(gameObjectObserver.getById('5')).toEqual(gameObject5);
  });
});
