import { Scene } from '../../scene';
import { ActorQuery } from '../actor-query';
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

describe('Engine -> ActorQuery', () => {
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
    const query = new ActorQuery({
      scene,
      filter: [TestComponent1, TestComponent2],
    });

    scene.appendChild(actor1);
    scene.appendChild(actor2);
    scene.appendChild(actor3);
    scene.appendChild(actor4);
    scene.appendChild(actor5);

    const expectedIds = ['4', '5'];

    let index = 0;
    query.getActors().forEach((actor) => {
      expect(actor.id).toEqual(expectedIds[index]);
      index += 1;
    });
  });

  it('Correct subscribe on new actors additions', () => {
    const query = new ActorQuery({ scene, filter: [TestComponent1] });
    const testFn1 = jest.fn();

    query.addEventListener(AddActor, testFn1);

    scene.appendChild(actor1);

    expect(testFn1.mock.calls.length).toEqual(1);
    expect(testFn1.mock.calls[0]).toMatchObject([
      {
        type: AddActor,
        target: query,
        actor: actor1,
      },
    ]);

    scene.appendChild(actor3);

    expect(testFn1.mock.calls.length).toEqual(1);

    actor3.setComponent(new TestComponent1());

    expect(testFn1.mock.calls.length).toEqual(2);
    expect(testFn1.mock.calls[1]).toMatchObject([
      {
        type: AddActor,
        target: query,
        actor: actor3,
      },
    ]);

    scene.appendChild(actor4);
    scene.appendChild(actor5);

    expect(testFn1.mock.calls.length).toEqual(4);
    expect(testFn1.mock.calls[2]).toMatchObject([
      {
        type: AddActor,
        target: query,
        actor: actor4,
      },
    ]);
    expect(testFn1.mock.calls[3]).toMatchObject([
      {
        type: AddActor,
        target: query,
        actor: actor5,
      },
    ]);
  });

  it('Correct subscribe on new actors removes', () => {
    const query = new ActorQuery({ scene, filter: [TestComponent1] });

    const testFn1 = jest.fn();

    query.addEventListener(RemoveActor, testFn1);

    scene.appendChild(actor1);
    scene.appendChild(actor2);
    scene.appendChild(actor3);
    scene.appendChild(actor4);
    scene.appendChild(actor5);

    expect(testFn1.mock.calls.length).toEqual(0);

    actor1.removeComponent(TestComponent1);

    expect(testFn1.mock.calls.length).toEqual(1);
    expect(testFn1.mock.calls[0]).toMatchObject([
      {
        type: RemoveActor,
        target: query,
        actor: actor1,
      },
    ]);

    scene.removeChild(actor3);
    scene.removeChild(actor4);
    actor5.removeComponent(TestComponent1);

    expect(testFn1.mock.calls.length).toEqual(3);
    expect(testFn1.mock.calls[1]).toMatchObject([
      {
        type: RemoveActor,
        target: query,
        actor: actor4,
      },
    ]);
    expect(testFn1.mock.calls[2]).toMatchObject([
      {
        type: RemoveActor,
        target: query,
        actor: actor5,
      },
    ]);
  });

  it('Correct unsubscribe from actor collection events', () => {
    const query = new ActorQuery({ scene, filter: [TestComponent1] });

    const testFn = jest.fn();

    query.addEventListener(AddActor, testFn);

    scene.appendChild(actor1);

    expect(testFn.mock.calls.length).toEqual(1);

    query.removeEventListener(AddActor, testFn);

    scene.appendChild(actor4);

    expect(testFn.mock.calls.length).toEqual(1);
  });

  it('Correctly adds all incoming child objects', () => {
    scene.appendChild(actor1);

    actor1.appendChild(actor2);
    actor1.appendChild(actor3);
    actor2.appendChild(actor4);
    actor3.appendChild(actor5);

    const query = new ActorQuery({ scene, filter: [TestComponent1] });

    expect(Array.from(query.getActors())).toStrictEqual([
      actor1,
      actor2,
      actor4,
      actor5,
    ]);
  });

  it('Update set if actor was filtered', () => {
    scene.appendChild(actor1);
    scene.appendChild(actor2);
    scene.appendChild(actor3);
    scene.appendChild(actor4);
    scene.appendChild(actor5);

    const query = new ActorQuery({
      scene,
      filter: [TestComponent1],
    });

    expect(query.getActors().size).toBe(4);

    actor2.removeComponent(TestComponent1);
    actor5.remove();

    expect(query.getActors().size).toBe(2);
  });
});
