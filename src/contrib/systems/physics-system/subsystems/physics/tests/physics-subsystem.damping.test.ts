import { Scene } from '../../../../../../engine/scene';
import { TemplateCollection } from '../../../../../../engine/template';
import { ActorCreator, Actor } from '../../../../../../engine/actor';
import { Vector2 } from '../../../../../../engine/math-lib';
import { RigidBody } from '../../../../../components/rigid-body';
import { Collider } from '../../../../../components/collider';
import { PhysicsSubsystem } from '../index';
import { createTime } from '../../../tests/helpers';

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

const createBody = (linearDamping: number): Actor => {
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
      linearDamping,
      autoSleep: false,
      disabled: false,
      oneWay: false,
    }),
  );

  return actor;
};

describe('PhysicsSystem -> PhysicsSubsystem -> linear damping', () => {
  it('Slows a moving body under zero gravity', () => {
    const scene = createScene();
    const physicsSubsystem = new PhysicsSubsystem({
      scene,
      time: createTime(),
      getGravity: (): Vector2 => new Vector2(0, 0),
    });
    const body = createBody(1);
    const rigidBody = body.getComponent(RigidBody);

    rigidBody.linearVelocity = new Vector2(10, 0);
    scene.appendChild(body);

    physicsSubsystem.integrateVelocities();

    // Velocity-proportional decay: v *= (1 - damping * dt) = 10 * (1 - 0.1).
    expect(rigidBody.linearVelocity.x).toBeCloseTo(9);
    expect(rigidBody.linearVelocity.y).toBeCloseTo(0);
  });

  it('Leaves velocity unchanged when damping is zero', () => {
    const scene = createScene();
    const physicsSubsystem = new PhysicsSubsystem({
      scene,
      time: createTime(),
      getGravity: (): Vector2 => new Vector2(0, 0),
    });
    const body = createBody(0);
    const rigidBody = body.getComponent(RigidBody);

    rigidBody.linearVelocity = new Vector2(10, 0);
    scene.appendChild(body);

    physicsSubsystem.integrateVelocities();

    expect(rigidBody.linearVelocity.x).toBeCloseTo(10);
  });
});
