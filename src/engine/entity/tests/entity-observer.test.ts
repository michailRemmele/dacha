import { Scene } from '../../scene';
import { createMockComponent } from '../../../__mocks__';
import { EntityObserver } from '../entity-observer';
import { EntityCreator } from '../entity-creator';
import { Entity } from '../entity';

jest.mock('../../ioc/ioc');

describe('Engine -> EntityObserver', () => {
  let scene: Scene;

  let entity1: Entity;
  let entity2: Entity;
  let entity3: Entity;
  let entity4: Entity;
  let entity5: Entity;

  beforeEach(() => {
    scene = new Scene({
      name: 'test-scene',
      entities: [],
      availableSystems: {},
      helpers: {},
      systems: [],
      entityCreator: new EntityCreator({}),
    });

    entity1 = new Entity({
      id: '1',
      name: 'entity-1',
      type: 'correct-type',
    });
    entity2 = new Entity({
      id: '2',
      name: 'entity-2',
      type: 'incorrect-type',
    });
    entity3 = new Entity({
      id: '3',
      name: 'entity-3',
      type: 'correct-type',
    });
    entity4 = new Entity({
      id: '4',
      name: 'entity-4',
      type: 'correct-type',
    });
    entity5 = new Entity({
      id: '5',
      name: 'entity-5',
      type: 'correct-type',
    });

    entity1.setComponent('test-1', createMockComponent('test-1'));

    entity2.setComponent('test-1', createMockComponent('test-1'));

    entity3.setComponent('test-2', createMockComponent('test-2'));

    entity4.setComponent('test-1', createMockComponent('test-1'));
    entity4.setComponent('test-2', createMockComponent('test-2'));

    entity5.setComponent('test-1', createMockComponent('test-1'));
    entity5.setComponent('test-2', createMockComponent('test-2'));
    entity5.setComponent('test-3', createMockComponent('test-3'));
  });

  it('Correct filters game objects by components', () => {
    const entityObserver = new EntityObserver(scene, {
      components: ['test-1', 'test-2'],
      type: 'correct-type',
    });

    scene.addEntity(entity1);
    scene.addEntity(entity2);
    scene.addEntity(entity3);
    scene.addEntity(entity4);
    scene.addEntity(entity5);

    expect(entityObserver.size()).toEqual(2);

    const [id4, id5] = entityObserver.map((entity) => entity.getId());
    expect(id4).toEqual('4');
    expect(id5).toEqual('5');

    const expectedIds = ['4', '5'];
    entityObserver.forEach((entity, index) => {
      expect(entity.getId()).toEqual(expectedIds[index]);
    });
  });

  it('Correct subscribe on new game objects additions', () => {
    const entityObserver = new EntityObserver(scene, {
      components: ['test-1'],
      type: 'correct-type',
    });
    const testFn1 = jest.fn();
    const testFn2 = jest.fn();

    entityObserver.subscribe('onadd', testFn1);
    entityObserver.subscribe('onadd', testFn2);

    scene.addEntity(entity1);

    expect(testFn1.mock.calls.length).toEqual(0);
    expect(testFn2.mock.calls.length).toEqual(0);

    entityObserver.fireEvents();

    expect(testFn1.mock.calls.length).toEqual(1);
    expect(testFn1.mock.calls[0]).toEqual([entity1]);
    expect(testFn2.mock.calls.length).toEqual(1);
    expect(testFn2.mock.calls[0]).toEqual([entity1]);
    expect(entityObserver.size()).toEqual(1);

    scene.addEntity(entity2);
    entityObserver.fireEvents();

    expect(testFn1.mock.calls.length).toEqual(1);
    expect(testFn2.mock.calls.length).toEqual(1);
    expect(entityObserver.size()).toEqual(1);

    scene.addEntity(entity3);
    entityObserver.fireEvents();

    expect(testFn1.mock.calls.length).toEqual(1);
    expect(testFn2.mock.calls.length).toEqual(1);
    expect(entityObserver.size()).toEqual(1);

    entity3.setComponent('test-1', createMockComponent('test-1'));
    entityObserver.fireEvents();

    expect(testFn1.mock.calls.length).toEqual(2);
    expect(testFn1.mock.calls[1]).toEqual([entity3]);
    expect(testFn2.mock.calls.length).toEqual(2);
    expect(testFn2.mock.calls[1]).toEqual([entity3]);
    expect(entityObserver.size()).toEqual(2);

    scene.addEntity(entity4);
    scene.addEntity(entity5);
    entityObserver.fireEvents();

    expect(testFn1.mock.calls.length).toEqual(4);
    expect(testFn1.mock.calls[2]).toEqual([entity4]);
    expect(testFn1.mock.calls[3]).toEqual([entity5]);
    expect(testFn2.mock.calls.length).toEqual(4);
    expect(testFn2.mock.calls[2]).toEqual([entity4]);
    expect(testFn2.mock.calls[3]).toEqual([entity5]);
    expect(entityObserver.size()).toEqual(4);
  });

  it('Correct subscribe on new game objects removes', () => {
    const entityObserver = new EntityObserver(scene, {
      components: ['test-1'],
      type: 'correct-type',
    });

    const testFn1 = jest.fn();
    const testFn2 = jest.fn();

    entityObserver.subscribe('onremove', testFn1);
    entityObserver.subscribe('onremove', testFn2);

    scene.addEntity(entity1);
    scene.addEntity(entity2);
    scene.addEntity(entity3);
    scene.addEntity(entity4);
    scene.addEntity(entity5);

    entityObserver.fireEvents();

    expect(testFn1.mock.calls.length).toEqual(0);
    expect(testFn2.mock.calls.length).toEqual(0);
    expect(entityObserver.size()).toEqual(3);

    entity1.removeComponent('test-1');
    entityObserver.fireEvents();

    expect(testFn1.mock.calls.length).toEqual(1);
    expect(testFn1.mock.calls[0]).toEqual([entity1]);
    expect(testFn2.mock.calls.length).toEqual(1);
    expect(testFn2.mock.calls[0]).toEqual([entity1]);
    expect(entityObserver.size()).toEqual(2);

    scene.removeEntity(entity4);
    entity5.removeComponent('test-1');
    entityObserver.fireEvents();

    expect(testFn1.mock.calls.length).toEqual(3);
    expect(testFn1.mock.calls[1]).toEqual([entity4]);
    expect(testFn1.mock.calls[2]).toEqual([entity5]);
    expect(testFn2.mock.calls.length).toEqual(3);
    expect(testFn2.mock.calls[1]).toEqual([entity4]);
    expect(testFn2.mock.calls[2]).toEqual([entity5]);
    expect(entityObserver.size()).toEqual(0);
  });

  it('Correct unsubscribe from game object observer events', () => {
    const entityObserver = new EntityObserver(scene, {
      components: ['test-1'],
      type: 'correct-type',
    });

    const testFn = jest.fn();

    entityObserver.subscribe('onadd', testFn);

    scene.addEntity(entity1);
    entityObserver.fireEvents();

    expect(testFn.mock.calls.length).toEqual(1);

    entityObserver.unsubscribe('onadd', testFn);

    scene.addEntity(entity4);
    entityObserver.fireEvents();

    expect(testFn.mock.calls.length).toEqual(1);
  });

  it('Correct returns game objects by id and index', () => {
    const entityObserver = new EntityObserver(scene, {
      components: ['test-1', 'test-2'],
    });

    scene.addEntity(entity1);
    scene.addEntity(entity2);
    scene.addEntity(entity3);
    scene.addEntity(entity4);
    scene.addEntity(entity5);

    expect(entityObserver.getByIndex(0)).toEqual(entity4);
    expect(entityObserver.getByIndex(1)).toEqual(entity5);

    expect(entityObserver.getById('4')).toEqual(entity4);
    expect(entityObserver.getById('5')).toEqual(entity5);

    expect(entityObserver.getById('1')).toEqual(void 0);
    expect(entityObserver.getById('2')).toEqual(void 0);
    expect(entityObserver.getById('3')).toEqual(void 0);
  });

  it('Correct sorts game objects', () => {
    const entityObserver = new EntityObserver(scene, {
      components: ['test-1'],
    });

    scene.addEntity(entity5);
    scene.addEntity(entity4);
    scene.addEntity(entity2);
    scene.addEntity(entity3);
    scene.addEntity(entity1);

    const unsortedIds = ['5', '4', '2', '1'];
    entityObserver.forEach((entity, index) => {
      expect(entity.getId()).toEqual(unsortedIds[index]);
    });

    entityObserver.sort((a, b) => {
      if (a.getId() < b.getId()) { return -1; }
      if (a.getId() > b.getId()) { return 1; }
      return 0;
    });

    const sortedIds = ['1', '2', '4', '5'];
    entityObserver.forEach((entity, index) => {
      expect(entity.getId()).toEqual(sortedIds[index]);
    });
  });
});
