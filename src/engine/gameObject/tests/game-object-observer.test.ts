import { Scene } from '../../scene';
import { createMockComponent } from '../../../__mocks__';
import { GameObjectObserver } from '../game-object-observer';
import { GameObject } from '../game-object';

jest.mock('../../ioc/ioc');

describe('Engine -> GameObjectObserver', () => {
  let scene: Scene;

  let gameObject1: GameObject;
  let gameObject2: GameObject;
  let gameObject3: GameObject;
  let gameObject4: GameObject;
  let gameObject5: GameObject;

  beforeEach(() => {
    scene = new Scene({ name: 'test-scene', gameObjects: [] });

    gameObject1 = new GameObject('game-object-1');
    gameObject2 = new GameObject('game-object-2');
    gameObject3 = new GameObject('game-object-3');
    gameObject4 = new GameObject('game-object-4');
    gameObject5 = new GameObject('game-object-5');

    gameObject1.setType('correct-type');
    gameObject2.setType('incorrect-type');
    gameObject3.setType('correct-type');
    gameObject4.setType('correct-type');
    gameObject5.setType('correct-type');

    gameObject1.setComponent('test-1', createMockComponent('test-1'));

    gameObject2.setComponent('test-1', createMockComponent('test-1'));

    gameObject3.setComponent('test-2', createMockComponent('test-2'));

    gameObject4.setComponent('test-1', createMockComponent('test-1'));
    gameObject4.setComponent('test-2', createMockComponent('test-2'));

    gameObject5.setComponent('test-1', createMockComponent('test-1'));
    gameObject5.setComponent('test-2', createMockComponent('test-2'));
    gameObject5.setComponent('test-3', createMockComponent('test-3'));
  });

  it('Correct filters game objects by components', () => {
    const gameObjectObserver = new GameObjectObserver(scene, {
      components: ['test-1', 'test-2'],
      type: 'correct-type',
    });

    scene.addGameObject(gameObject1);
    scene.addGameObject(gameObject2);
    scene.addGameObject(gameObject3);
    scene.addGameObject(gameObject4);
    scene.addGameObject(gameObject5);

    expect(gameObjectObserver.size()).toEqual(2);

    const [id4, id5] = gameObjectObserver.map((gameObject) => gameObject.getId());
    expect(id4).toEqual('game-object-4');
    expect(id5).toEqual('game-object-5');

    const expectedIds = ['game-object-4', 'game-object-5'];
    gameObjectObserver.forEach((gameObject, index) => {
      expect(gameObject.getId()).toEqual(expectedIds[index]);
    });
  });

  it('Correct returns new added game objects', () => {
    const gameObjectObserver = new GameObjectObserver(scene, {
      components: ['test-1'],
      type: 'correct-type',
    });

    scene.addGameObject(gameObject1);
    expect(gameObjectObserver.getLastAdded()).toEqual([gameObject1]);
    expect(gameObjectObserver.size()).toEqual(1);

    scene.addGameObject(gameObject2);
    expect(gameObjectObserver.getLastAdded()).toEqual([]);
    expect(gameObjectObserver.size()).toEqual(1);

    scene.addGameObject(gameObject3);
    expect(gameObjectObserver.getLastAdded()).toEqual([]);
    expect(gameObjectObserver.size()).toEqual(1);

    gameObject3.setComponent('test-1', createMockComponent('test-1'));
    expect(gameObjectObserver.getLastAdded()).toEqual([gameObject3]);
    expect(gameObjectObserver.size()).toEqual(2);

    scene.addGameObject(gameObject4);
    scene.addGameObject(gameObject5);
    expect(gameObjectObserver.getLastAdded()).toEqual([gameObject4, gameObject5]);
    expect(gameObjectObserver.getLastAdded()).toEqual([]);
    expect(gameObjectObserver.size()).toEqual(4);
  });

  it('Correct returns new removed game objects', () => {
    const gameObjectObserver = new GameObjectObserver(scene, {
      components: ['test-1'],
      type: 'correct-type',
    });

    scene.addGameObject(gameObject1);
    scene.addGameObject(gameObject2);
    scene.addGameObject(gameObject3);
    scene.addGameObject(gameObject4);
    scene.addGameObject(gameObject5);

    expect(gameObjectObserver.size()).toEqual(3);

    gameObject1.removeComponent('test-1');

    expect(gameObjectObserver.getLastRemoved()).toEqual([gameObject1]);
    expect(gameObjectObserver.size()).toEqual(2);

    scene.removeGameObject(gameObject4);
    gameObject5.removeComponent('test-1');

    expect(gameObjectObserver.getLastRemoved()).toEqual([gameObject4, gameObject5]);
    expect(gameObjectObserver.getLastRemoved()).toEqual([]);
    expect(gameObjectObserver.size()).toEqual(0);
  });

  it('Correct returns game objects by id and index', () => {
    const gameObjectObserver = new GameObjectObserver(scene, {
      components: ['test-1', 'test-2'],
    });

    scene.addGameObject(gameObject1);
    scene.addGameObject(gameObject2);
    scene.addGameObject(gameObject3);
    scene.addGameObject(gameObject4);
    scene.addGameObject(gameObject5);

    expect(gameObjectObserver.getByIndex(0)).toEqual(gameObject4);
    expect(gameObjectObserver.getByIndex(1)).toEqual(gameObject5);

    expect(gameObjectObserver.getById('game-object-4')).toEqual(gameObject4);
    expect(gameObjectObserver.getById('game-object-5')).toEqual(gameObject5);

    expect(gameObjectObserver.getById('game-object-1')).toEqual(void 0);
    expect(gameObjectObserver.getById('game-object-2')).toEqual(void 0);
    expect(gameObjectObserver.getById('game-object-3')).toEqual(void 0);
  });

  it('Correct sorts game objects', () => {
    const gameObjectObserver = new GameObjectObserver(scene, {
      components: ['test-1'],
    });

    scene.addGameObject(gameObject5);
    scene.addGameObject(gameObject4);
    scene.addGameObject(gameObject2);
    scene.addGameObject(gameObject3);
    scene.addGameObject(gameObject1);

    const unsortedIds = ['game-object-5', 'game-object-4', 'game-object-2', 'game-object-1'];
    gameObjectObserver.forEach((gameObject, index) => {
      expect(gameObject.getId()).toEqual(unsortedIds[index]);
    });

    gameObjectObserver.sort((a, b) => {
      if (a.getId() < b.getId()) { return -1; }
      if (a.getId() > b.getId()) { return 1; }
      return 0;
    });

    const sortedIds = ['game-object-1', 'game-object-2', 'game-object-4', 'game-object-5'];
    gameObjectObserver.forEach((gameObject, index) => {
      expect(gameObject.getId()).toEqual(sortedIds[index]);
    });
  });
});
