import { UIContextHost } from '../ui-context';
import type { UIContext } from '../types';
import { World } from '../../../../engine/world';
import { Scene } from '../../../../engine/scene';
import { Actor, ActorCreator } from '../../../../engine/actor';
import { Component } from '../../../../engine/component';
import { TemplateCollection } from '../../../../engine/template';
import { Assets } from '../../../../engine/asset';
import { ReferenceWalker } from '../../../../engine/reference';

class Marker extends Component {
  static componentName = 'Marker';
}

const createScene = (id: string): Scene => {
  const templateCollection = new TemplateCollection();
  return new Scene({
    id,
    name: id,
    actors: [],
    actorCreator: new ActorCreator([], templateCollection),
    templateCollection,
  });
};

const addActor = (scene: Scene, id: string, marked: boolean): Actor => {
  const actor = new Actor({ id, name: id });
  if (marked) {
    actor.setComponent(new Marker());
  }
  scene.appendChild(actor);
  return actor;
};

describe('UIContextHost', () => {
  let host: UIContextHost;
  let context: UIContext;

  beforeEach(() => {
    host = new UIContextHost({
      world: new World({ id: 'world', name: 'world' }),
      assets: new Assets({
        templates: new TemplateCollection(),
        walker: new ReferenceWalker([]),
      }),
      options: { menu: 's1' },
    });
    context = host.context;
  });

  it('scene is the entered scene and watch follows it', () => {
    const s1 = createScene('s1');
    const values: (Scene | undefined)[] = [];
    context
      .watch(({ scene }) => scene)
      .subscribe((value) => values.push(value));

    expect(context.scene).toBeUndefined();

    host.setScene(s1);
    expect(context.scene).toBe(s1);
    host.tick();
    host.tick();

    expect(values).toEqual([undefined, s1]);
  });

  it('watch notifies once per change', () => {
    let counter = 0;
    const listener = jest.fn();
    context.watch(() => counter).subscribe(listener);

    host.tick();
    host.tick();
    host.tick();
    expect(listener).toHaveBeenCalledTimes(1);

    counter = 1;
    host.tick();
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenLastCalledWith(1);
  });

  it('watch with equals does not notify for equal objects', () => {
    const n = 1;
    const listener = jest.fn();
    context
      .watch(
        () => ({ v: n }),
        (a, b) => a.v === b.v,
      )
      .subscribe(listener);

    host.tick();
    host.tick();

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('watch is not evaluated without subscribers', () => {
    const selector = jest.fn(() => 1);
    const value = context.watch(selector);

    host.tick();
    host.tick();
    expect(selector).not.toHaveBeenCalled();

    expect(value.get()).toBe(1);
    expect(selector).toHaveBeenCalledTimes(1);
  });

  it('findAll returns the actors with the components', () => {
    const scene = createScene('s1');
    const a = addActor(scene, 'a', true);
    addActor(scene, 'b', false);
    const c = addActor(scene, 'c', true);
    const value = context.watch(({ findAll }) => findAll([Marker]));

    expect(value.get()).toEqual([]);

    host.setScene(scene);
    expect(value.get()).toEqual([a, c]);
  });

  it('notifies about a list only when its items change', () => {
    const scene = createScene('s1');
    addActor(scene, 'a', true);
    host.setScene(scene);
    const listener = jest.fn();
    context.watch(({ findAll }) => findAll([Marker])).subscribe(listener);

    host.tick();
    host.tick();
    expect(listener).toHaveBeenCalledTimes(1);

    const b = addActor(scene, 'b', true);
    host.tick();
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener.mock.calls[1][0]).toHaveLength(2);

    scene.removeChild(b);
    host.tick();
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it('does not evaluate a value after its last listener left', () => {
    const selector = jest.fn(() => 1);
    const value = context.watch(selector);
    const offFirst = value.subscribe(() => undefined);
    const offSecond = value.subscribe(() => undefined);

    offFirst();
    host.tick();
    expect(selector).toHaveBeenCalledTimes(2);

    offSecond();
    offSecond();
    host.tick();
    expect(selector).toHaveBeenCalledTimes(2);

    value.subscribe(() => undefined);
    host.tick();
    expect(selector).toHaveBeenCalledTimes(4);
  });

  it('unsubscribe stops notifications', () => {
    let counter = 0;
    const listener = jest.fn();
    const off = context.watch(() => counter).subscribe(listener);

    off();
    counter = 1;
    host.tick();

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('find returns the actor with the components', () => {
    const scene = createScene('s1');
    const marked = addActor(scene, 'a', true);
    addActor(scene, 'b', false);
    const value = context.watch(({ find }) => find([Marker]));

    expect(value.get()).toBeUndefined();

    host.setScene(scene);
    expect(value.get()).toBe(marked);
  });

  it("find returns the new scene's actor after a scene change", () => {
    const s1 = createScene('s1');
    const s2 = createScene('s2');
    const a1 = addActor(s1, 'a1', true);
    const value = context.watch(({ find }) => find([Marker]));

    host.setScene(s1);
    expect(value.get()).toBe(a1);

    host.setScene(undefined);
    s1.removeChild(a1);
    const a2 = addActor(s2, 'a2', true);
    host.setScene(s2);
    expect(value.get()).toBe(a2);

    addActor(s1, 'late', true);
    expect(value.get()).toBe(a2);
  });

  it('destroy destroys cached queries', () => {
    const scene = createScene('s1');
    addActor(scene, 'a', true);
    host.setScene(scene);
    context.watch(({ find }) => find([Marker])).get();

    host.destroy();

    expect(context.watch(({ find }) => find([Marker])).get()).toBeUndefined();
  });
});
