import { ActorCreator, ActorSpawner, Actor } from '../../../../engine/actor';
import { World } from '../../../../engine/world';
import { TemplateCollection } from '../../../../engine/template';
import { Collider, RigidBody } from '../../../components';
import { createScene, createTime } from './helpers';
import { PhysicsSystem } from '../index';

describe('Systems -> PhysicsSystem -> default gravity', () => {
  it('applies earth-like gravity when no gravity is configured', () => {
    const scene = createScene();
    const world = new World({ id: 'world', name: 'world' });
    const templateCollection = new TemplateCollection();
    const actorCreator = new ActorCreator([], templateCollection);
    const time = createTime(); // fixedDeltaTime = 0.1

    world.appendChild(scene);

    // Construct without gravityX / gravityY -> should default to (0, 980).
    const physicsSystem = new PhysicsSystem({
      scene,
      world,
      actorSpawner: new ActorSpawner(actorCreator),
      globalOptions: {},
      templateCollection,
      time,
    } as never);
    physicsSystem.onSceneEnter?.();

    const actor = new Actor({ id: 'body', name: 'body' });
    actor.setComponent(
      new Collider({
        type: 'box',
        offsetX: 0,
        offsetY: 0,
        sizeX: 2,
        sizeY: 2,
        layer: 'default',
        disabled: false,
      }),
    );
    actor.setComponent(
      new RigidBody({
        type: 'dynamic',
        mass: 1,
        gravityScale: 1,
        linearDamping: 0,
        disabled: false,
        oneWay: false,
      }),
    );
    scene.appendChild(actor);

    physicsSystem.fixedUpdate();

    // One 0.1s step under g = 980 adds 98 px/s of downward (+Y) velocity.
    expect(actor.getComponent(RigidBody).linearVelocity.y).toBeCloseTo(98);
  });
});
