import { Actor, ActorCreator, ActorSpawner } from '../../../../engine/actor';
import { Scene } from '../../../../engine/scene';
import { TemplateCollection } from '../../../../engine/template';
import { World } from '../../../../engine/world';
import { Time } from '../../../../engine/time';
import { Interpolation } from '../../../components/interpolation';
import type { InterpolationConfig } from '../../../components/interpolation';
import { Transform } from '../../../components/transform';
import { Interpolator } from '../system';

export const createScene = (): Scene => {
  const templateCollection = new TemplateCollection();
  const actorCreator = new ActorCreator([], templateCollection);

  return new Scene({
    id: 'scene',
    name: 'scene',
    actors: [],
    actorCreator,
    templateCollection,
  });
};

export const createInterpolator = (
  scene: Scene,
): { system: Interpolator; world: World; time: Time } => {
  const world = new World({ id: 'world', name: 'world' });
  const templateCollection = new TemplateCollection();
  const actorCreator = new ActorCreator([], templateCollection);
  const time = new Time();
  time.fixedDeltaTime = 0.1;

  world.appendChild(scene);

  const system = new Interpolator({
    scene,
    world,
    actorSpawner: new ActorSpawner(actorCreator),
    globalOptions: {},
    templateCollection,
    time,
  });

  system.onSceneEnter?.();

  return { system, world, time };
};

export const createInterpolatedActor = (
  id: string,
  x: number,
  y: number,
  config: InterpolationConfig = {},
): Actor => {
  const actor = new Actor({ id, name: id });
  const transform = actor.getComponent(Transform);

  transform.local.position.x = x;
  transform.local.position.y = y;

  actor.setComponent(new Interpolation(config));

  return actor;
};
