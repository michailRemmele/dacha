import { Scene } from '../../../../engine/scene';
import { Actor, ActorCreator, ActorSpawner } from '../../../../engine/actor';
import { World } from '../../../../engine/world';
import { TemplateCollection } from '../../../../engine/template';
import { Assets } from '../../../../engine/asset';
import { Texture } from '../../../assets';
import { Time } from '../../../../engine/time';
import { Behaviors } from '../../../components';
import { BehaviorSystem } from '../system';
import { Behavior } from '../types';
import type { BehaviorOptions } from '../types';

let capturedOptions: BehaviorOptions | undefined;

class CaptureBehavior extends Behavior {
  constructor(options: BehaviorOptions) {
    super();
    capturedOptions = options;
  }
}
CaptureBehavior.behaviorName = 'capture';

describe('Contrib -> systems -> BehaviorSystem', () => {
  beforeEach(() => {
    capturedOptions = undefined;
  });

  it('passes the asset registry to behaviors', () => {
    const assets = new Assets([Texture]);
    assets.register({
      id: 'a1',
      name: 'Hero',
      kind: 'texture',
      data: { src: 'img/hero.png' },
    });

    const templateCollection = new TemplateCollection();
    const actorCreator = new ActorCreator([Behaviors], templateCollection);
    const scene = new Scene({
      id: 'scene-1',
      name: 'scene-1',
      actors: [],
      actorCreator,
      templateCollection,
    });

    const actor = new Actor({ id: 'actor-1', name: 'actor-1' });
    actor.setComponent(
      new Behaviors({
        list: [{ id: 'b1', name: 'capture', options: {} }],
      }),
    );
    scene.appendChild(actor);

    const system = new BehaviorSystem({
      scene,
      world: new World({ id: 'world', name: 'world' }),
      actorSpawner: new ActorSpawner(actorCreator),
      templateCollection,
      assets,
      globalOptions: {},
      resources: [CaptureBehavior],
      time: new Time(),
    });

    system.onSceneEnter();

    expect(capturedOptions?.assets).toBe(assets);
    expect(capturedOptions?.assets.get('a1', Texture).src).toBe(
      'img/hero.png',
    );
  });
});
