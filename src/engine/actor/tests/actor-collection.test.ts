import { Scene } from '../../scene';
import { ActorCollection } from '../actor-collection';
import { ActorCreator } from '../actor-creator';
import { Actor } from '../actor';
import { TemplateCollection } from '../../template';
import { Component } from '../../component';
import { AddActor, RemoveActor } from '../../events';

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

describe('Engine -> ActorCollection', () => {
  let scene: Scene;

  let actor1: Actor;
  let actor2: Actor;
  let actor3: Actor;
  let actor4: Actor;
  let actor5: Actor;

  beforeEach(() => {
    const templateCollection = new TemplateCollection([]);
    scene = new Scene({
      id: '000',
      name: 'test-scene',
      actors: [],
      actorCreator: new ActorCreator([], templateCollection),
      templateCollection,
    });

    actor1 = new Actor({
      id: '1',
      name: 'actor-1',
    });
    actor2 = new Actor({
      id: '2',
      name: 'actor-2',
    });
    actor3 = new Actor({
      id: '3',
      name: 'actor-3',
    });
    actor4 = new Actor({
      id: '4',
      name: 'actor-4',
    });
    actor5 = new Actor({
      id: '5',
      name: 'actor-5',
    });

    actor1.setComponent(new TestComponent1());

    actor2.setComponent(new TestComponent1());

    actor3.setComponent(new TestComponent2());

    actor4.setComponent(new TestComponent1());
    actor4.setComponent(new TestComponent2());

    actor5.setComponent(new TestComponent1());
    actor5.setComponent(new TestComponent2());
    actor5.setComponent(new TestComponent3());
  });

  it('Correct filters actors by components', () => {
    const actorCollection = new ActorCollection(scene, {
      components: [TestComponent1, TestComponent2],
    });

    scene.appendChild(actor1);
    scene.appendChild(actor2);
    scene.appendChild(actor3);
    scene.appendChild(actor4);
    scene.appendChild(actor5);

    expect(actorCollection.size).toEqual(2);

    const expectedIds = ['4', '5'];
    actorCollection.forEach((actor, index) => {
      expect(actor.id).toEqual(expectedIds[index]);
    });
  });

  it('Correct subscribe on new actors additions', () => {
    const actorCollection = new ActorCollection(scene, {
      components: [TestComponent1],
    });
    const testFn1 = jest.fn();
    const testFn2 = jest.fn();

    actorCollection.addEventListener(AddActor, testFn1);
    actorCollection.addEventListener(AddActor, testFn2);

    scene.appendChild(actor1);

    expect(testFn1.mock.calls.length).toEqual(1);
    expect(testFn1.mock.calls[0]).toMatchObject([{
      type: AddActor,
      target: actorCollection,
      actor: actor1,
    }]);
    expect(testFn2.mock.calls.length).toEqual(1);
    expect(testFn2.mock.calls[0]).toMatchObject([{
      type: AddActor,
      target: actorCollection,
      actor: actor1,
    }]);
    expect(actorCollection.size).toEqual(1);

    scene.appendChild(actor3);

    expect(testFn1.mock.calls.length).toEqual(1);
    expect(testFn2.mock.calls.length).toEqual(1);
    expect(actorCollection.size).toEqual(1);

    actor3.setComponent(new TestComponent1());

    expect(testFn1.mock.calls.length).toEqual(2);
    expect(testFn1.mock.calls[1]).toMatchObject([{
      type: AddActor,
      target: actorCollection,
      actor: actor3,
    }]);
    expect(testFn2.mock.calls.length).toEqual(2);
    expect(testFn2.mock.calls[1]).toMatchObject([{
      type: AddActor,
      target: actorCollection,
      actor: actor3,
    }]);
    expect(actorCollection.size).toEqual(2);

    scene.appendChild(actor4);
    scene.appendChild(actor5);

    expect(testFn1.mock.calls.length).toEqual(4);
    expect(testFn1.mock.calls[2]).toMatchObject([{
      type: AddActor,
      target: actorCollection,
      actor: actor4,
    }]);
    expect(testFn1.mock.calls[3]).toMatchObject([{
      type: AddActor,
      target: actorCollection,
      actor: actor5,
    }]);
    expect(testFn2.mock.calls.length).toEqual(4);
    expect(testFn2.mock.calls[2]).toMatchObject([{
      type: AddActor,
      target: actorCollection,
      actor: actor4,
    }]);
    expect(testFn2.mock.calls[3]).toMatchObject([{
      type: AddActor,
      target: actorCollection,
      actor: actor5,
    }]);
    expect(actorCollection.size).toEqual(4);
  });

  it('Correct subscribe on new actors removes', () => {
    const actorCollection = new ActorCollection(scene, {
      components: [TestComponent1],
    });

    const testFn1 = jest.fn();
    const testFn2 = jest.fn();

    actorCollection.addEventListener(RemoveActor, testFn1);
    actorCollection.addEventListener(RemoveActor, testFn2);

    scene.appendChild(actor1);
    scene.appendChild(actor2);
    scene.appendChild(actor3);
    scene.appendChild(actor4);
    scene.appendChild(actor5);

    expect(testFn1.mock.calls.length).toEqual(0);
    expect(testFn2.mock.calls.length).toEqual(0);
    expect(actorCollection.size).toEqual(4);

    actor1.removeComponent(TestComponent1);

    expect(testFn1.mock.calls.length).toEqual(1);
    expect(testFn1.mock.calls[0]).toMatchObject([{
      type: RemoveActor,
      target: actorCollection,
      actor: actor1,
    }]);
    expect(testFn2.mock.calls.length).toEqual(1);
    expect(testFn2.mock.calls[0]).toMatchObject([{
      type: RemoveActor,
      target: actorCollection,
      actor: actor1,
    }]);
    expect(actorCollection.size).toEqual(3);

    scene.removeChild(actor3);
    scene.removeChild(actor4);
    actor5.removeComponent(TestComponent1);

    expect(testFn1.mock.calls.length).toEqual(3);
    expect(testFn1.mock.calls[1]).toMatchObject([{
      type: RemoveActor,
      target: actorCollection,
      actor: actor4,
    }]);
    expect(testFn1.mock.calls[2]).toMatchObject([{
      type: RemoveActor,
      target: actorCollection,
      actor: actor5,
    }]);
    expect(testFn2.mock.calls.length).toEqual(3);
    expect(testFn2.mock.calls[1]).toMatchObject([{
      type: RemoveActor,
      target: actorCollection,
      actor: actor4,
    }]);
    expect(testFn2.mock.calls[2]).toMatchObject([{
      type: RemoveActor,
      target: actorCollection,
      actor: actor5,
    }]);
    expect(actorCollection.size).toEqual(1);
  });

  it('Correct unsubscribe from actor collection events', () => {
    const actorCollection = new ActorCollection(scene, {
      components: [TestComponent1],
    });

    const testFn = jest.fn();

    actorCollection.addEventListener(AddActor, testFn);

    scene.appendChild(actor1);

    expect(testFn.mock.calls.length).toEqual(1);

    actorCollection.removeEventListener(AddActor, testFn);

    scene.appendChild(actor4);

    expect(testFn.mock.calls.length).toEqual(1);
  });

  it('Correct returns actors by id and index', () => {
    const actorCollection = new ActorCollection(scene, {
      components: [TestComponent1, TestComponent2],
    });

    scene.appendChild(actor1);
    scene.appendChild(actor2);
    scene.appendChild(actor3);
    scene.appendChild(actor4);
    scene.appendChild(actor5);

    expect(actorCollection.getById('4')).toEqual(actor4);
    expect(actorCollection.getById('5')).toEqual(actor5);

    expect(actorCollection.getById('1')).toEqual(void 0);
    expect(actorCollection.getById('2')).toEqual(void 0);
    expect(actorCollection.getById('3')).toEqual(void 0);
  });

  it('Correct sorts actors', () => {
    const actorCollection = new ActorCollection(scene, {
      components: [TestComponent1],
    });

    scene.appendChild(actor5);
    scene.appendChild(actor4);
    scene.appendChild(actor2);
    scene.appendChild(actor3);
    scene.appendChild(actor1);

    const unsortedIds = ['5', '4', '2', '1'];
    actorCollection.forEach((actor, index) => {
      expect(actor.id).toEqual(unsortedIds[index]);
    });

    actorCollection.sort((a, b) => {
      if (a.id < b.id) { return -1; }
      if (a.id > b.id) { return 1; }
      return 0;
    });

    const sortedIds = ['1', '2', '4', '5'];
    actorCollection.forEach((actor, index) => {
      expect(actor.id).toEqual(sortedIds[index]);
    });
  });

  it('Correctly adds all incoming child objects', () => {
    scene.appendChild(actor1);

    actor1.appendChild(actor2);
    actor1.appendChild(actor3);
    actor2.appendChild(actor4);
    actor3.appendChild(actor5);

    const actorCollection = new ActorCollection(scene, {
      components: [TestComponent1],
    });

    expect(actorCollection.size).toEqual(4);

    expect(actorCollection.getById('1')).toEqual(actor1);
    expect(actorCollection.getById('2')).toEqual(actor2);
    expect(actorCollection.getById('3')).toBeUndefined();
    expect(actorCollection.getById('4')).toEqual(actor4);
    expect(actorCollection.getById('5')).toEqual(actor5);
  });

  it('Correctly adds all incoming child objects', () => {
    const actorCollection = new ActorCollection(scene, {
      components: [TestComponent1],
    });

    scene.appendChild(actor1);

    actor1.appendChild(actor2);
    actor1.appendChild(actor3);
    actor2.appendChild(actor4);
    actor3.appendChild(actor5);

    expect(actorCollection.size).toEqual(4);

    expect(actorCollection.getById('1')).toEqual(actor1);
    expect(actorCollection.getById('2')).toEqual(actor2);
    expect(actorCollection.getById('3')).toBeUndefined();
    expect(actorCollection.getById('4')).toEqual(actor4);
    expect(actorCollection.getById('5')).toEqual(actor5);
  });
});
