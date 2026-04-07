import { ActorCreator, ActorSpawner, Actor } from '../../../../engine/actor';
import { Scene } from '../../../../engine/scene';
import { TemplateCollection } from '../../../../engine/template';
import { World } from '../../../../engine/world';
import { Collider, RigidBody } from '../../../components';
import { Transform } from '../../../components/transform';
import { PhysicsSystem } from '../index';
import type { PhysicsSettings } from '../types';

const createScene = (): Scene => {
  const templateCollection = new TemplateCollection([]);
  const actorCreator = new ActorCreator([], templateCollection);

  return new Scene({
    id: 'scene',
    name: 'scene',
    actors: [],
    actorCreator,
    templateCollection,
  });
};

const createPhysicsSystem = (
  scene: Scene,
  settings?: PhysicsSettings,
): PhysicsSystem => {
  const world = new World({ id: 'world', name: 'world' });
  const templateCollection = new TemplateCollection([]);
  const actorCreator = new ActorCreator([], templateCollection);

  world.appendChild(scene);

  return new PhysicsSystem({
    scene,
    world,
    gravity: 0,
    actorSpawner: new ActorSpawner(actorCreator),
    globalOptions: settings ? { physics: settings } : {},
    templateCollection,
  });
};

const createBoxActor = (
  id: string,
  type: 'dynamic' | 'static',
  positionY: number,
  colliderConfig: Pick<Collider, 'layer'> = { layer: 'default' },
): Actor => {
  const actor = new Actor({ id, name: id });
  const transform = actor.getComponent(Transform);

  transform.world.position.y = positionY;
  actor.setComponent(
    new Collider({
      type: 'box',
      centerX: 0,
      centerY: 0,
      sizeX: 2,
      sizeY: 2,
      layer: colliderConfig.layer,
    }),
  );
  actor.setComponent(
    new RigidBody({
      type,
      mass: 1,
      gravityScale: 0,
      linearDamping: 0,
      disabled: false,
    }),
  );

  return actor;
};

describe('PhysicsSystem', () => {
  it('Stops a falling body from continuing through a static floor', () => {
    const scene = createScene();
    const physicsSystem = createPhysicsSystem(scene);
    const floor = createBoxActor('floor', 'static', 3);
    const body = createBoxActor('body', 'dynamic', 0);
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    rigidBody.linearVelocity.y = 15;

    scene.appendChild(floor);
    scene.appendChild(body);

    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(rigidBody.linearVelocity.y).toBeCloseTo(0);
    expect(transform.world.position.y).toBeLessThanOrEqual(1.02);
  });

  it('Skips collision resolution when collision matrix disables a pair', () => {
    const scene = createScene();
    const physicsSystem = createPhysicsSystem(scene, {
      collisionLayers: [
        { id: 'body', name: 'Body' },
        { id: 'floor', name: 'Floor' },
      ],
      collisionMatrix: {
        body: { floor: false },
        floor: { body: false },
      },
    });
    const floor = createBoxActor('floor', 'static', 3, {
      layer: 'floor',
    });
    const body = createBoxActor('body', 'dynamic', 0, {
      layer: 'body',
    });
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    rigidBody.linearVelocity.y = 15;

    scene.appendChild(floor);
    scene.appendChild(body);

    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(rigidBody.linearVelocity.y).toBeCloseTo(15);
    expect(transform.world.position.y).toBeGreaterThan(1.02);
  });
});
