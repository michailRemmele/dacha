import { Scene } from '../../../../../../engine/scene';
import { TemplateCollection } from '../../../../../../engine/template';
import { ActorCreator, Actor } from '../../../../../../engine/actor';
import { Vector2 } from '../../../../../../engine/math-lib';
import { RigidBody } from '../../../../../components/rigid-body';
import { Collider } from '../../../../../components/collider';
import { PhysicsSubsystem } from '../index';

const createScene = (): Scene => {
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

const createFreeBody = (): Actor => {
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
      gravityScale: 0,
      linearDamping: 0,
      disabled: false,
      oneWay: false,
    }),
  );

  return actor;
};

describe('PhysicsSystem -> PhysicsSubsystem -> sleep options', () => {
  it('Does not sleep a body with residual angular velocity above the default angularSleepThreshold', () => {
    const scene = createScene();
    const physicsSubsystem = new PhysicsSubsystem({
      scene,
      getGravity: (): Vector2 => new Vector2(0, 0),
    });
    const body = createFreeBody();
    const rigidBody = body.getComponent(RigidBody);

    rigidBody.angularVelocity = 0.08;
    scene.appendChild(body);

    for (let i = 0; i < 10; i += 1) {
      physicsSubsystem.updateSleepTimers({ deltaTime: 0.1, deltaTimeMs: 100, elapsedTime: 0 });
    }

    expect(rigidBody.sleeping).toBe(false);
  });

  it('Sleeps a body with residual angular velocity when angularSleepThreshold is raised', () => {
    const scene = createScene();
    const physicsSubsystem = new PhysicsSubsystem({
      scene,
      getGravity: (): Vector2 => new Vector2(0, 0),
      angularSleepThreshold: 0.1,
    });
    const body = createFreeBody();
    const rigidBody = body.getComponent(RigidBody);

    rigidBody.angularVelocity = 0.08;
    scene.appendChild(body);

    for (let i = 0; i < 10; i += 1) {
      physicsSubsystem.updateSleepTimers({ deltaTime: 0.1, deltaTimeMs: 100, elapsedTime: 0 });
    }

    expect(rigidBody.sleeping).toBe(true);
  });

  it('Delays sleep until the configured sleepTimeThreshold elapses', () => {
    const scene = createScene();
    const physicsSubsystem = new PhysicsSubsystem({
      scene,
      getGravity: (): Vector2 => new Vector2(0, 0),
      sleepTimeThreshold: 100,
    });
    const body = createFreeBody();
    const rigidBody = body.getComponent(RigidBody);

    scene.appendChild(body);

    for (let i = 0; i < 10; i += 1) {
      physicsSubsystem.updateSleepTimers({ deltaTime: 0.1, deltaTimeMs: 100, elapsedTime: 0 });
    }

    expect(rigidBody.sleeping).toBe(false);
  });
});
