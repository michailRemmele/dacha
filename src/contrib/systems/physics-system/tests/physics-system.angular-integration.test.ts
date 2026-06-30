import { Actor } from '../../../../engine/actor';
import { Vector2 } from '../../../../engine/math-lib';
import { Collider, RigidBody } from '../../../components';
import { Transform } from '../../../components/transform';

import { createPhysicsSystem, createScene } from './helpers';

const createDynamicBody = (
  config: Partial<ConstructorParameters<typeof RigidBody>[0]> = {},
): Actor => {
  const actor = new Actor({ id: 'body', name: 'body' });

  actor.setComponent(
    new RigidBody({
      type: 'dynamic',
      mass: 1,
      gravityScale: 0,
      linearDamping: 0,
      disabled: false,
      oneWay: false,
      ...config,
    }),
  );
  actor.setComponent(
    new Collider({
      type: 'circle',
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      layer: 'default',
      disabled: false,
    }),
  );

  return actor;
};

describe('Systems -> PhysicsSystem -> angular integration', () => {
  it('Integrates angular velocity into transform rotation', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const actor = createDynamicBody();
    const rigidBody = actor.getComponent(RigidBody);
    const transform = actor.getComponent(Transform);

    rigidBody.angularVelocity = 2;
    scene.appendChild(actor);

    physicsSystem.fixedUpdate({ deltaTime: 500 });

    expect(transform.world.rotation).toBeCloseTo(1);
  });

  it('Applies torque before integrating rotation', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const actor = createDynamicBody();
    const rigidBody = actor.getComponent(RigidBody);
    const transform = actor.getComponent(Transform);

    rigidBody.applyTorque(4);
    scene.appendChild(actor);

    physicsSystem.fixedUpdate({ deltaTime: 1000 });

    expect(rigidBody.angularVelocity).toBeCloseTo(2);
    expect(transform.world.rotation).toBeCloseTo(2);
    expect(rigidBody._torque).toBe(0);
  });

  it('Applies angular impulse before integrating rotation', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const actor = createDynamicBody();
    const rigidBody = actor.getComponent(RigidBody);
    const transform = actor.getComponent(Transform);

    rigidBody.applyAngularImpulse(6);
    scene.appendChild(actor);

    physicsSystem.fixedUpdate({ deltaTime: 1000 });

    expect(rigidBody.angularVelocity).toBeCloseTo(3);
    expect(transform.world.rotation).toBeCloseTo(3);
    expect(rigidBody._angularImpulse).toBe(0);
  });

  it('Applies force from a world-space position', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const actor = createDynamicBody();
    const rigidBody = actor.getComponent(RigidBody);

    rigidBody.applyForce(new Vector2(0, 4), { x: 1, y: 0 });
    scene.appendChild(actor);

    physicsSystem.fixedUpdate({ deltaTime: 1000 });

    expect(rigidBody.linearVelocity.y).toBeCloseTo(4);
    expect(rigidBody.angularVelocity).toBeCloseTo(2);
    expect(rigidBody._pointForces).toHaveLength(0);
  });

  it('Applies impulse from a world-space position', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const actor = createDynamicBody();
    const rigidBody = actor.getComponent(RigidBody);

    rigidBody.applyImpulse(new Vector2(0, 4), { x: 1, y: 0 });
    scene.appendChild(actor);

    physicsSystem.fixedUpdate({ deltaTime: 1000 });

    expect(rigidBody.linearVelocity.y).toBeCloseTo(4);
    expect(rigidBody.angularVelocity).toBeCloseTo(2);
    expect(rigidBody._pointImpulses).toHaveLength(0);
  });

  it('Applies angular damping', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const actor = createDynamicBody({ angularDamping: 1 });
    const rigidBody = actor.getComponent(RigidBody);
    const transform = actor.getComponent(Transform);

    rigidBody.angularVelocity = 10;
    scene.appendChild(actor);

    physicsSystem.fixedUpdate({ deltaTime: 500 });

    expect(rigidBody.angularVelocity).toBeCloseTo(5);
    expect(transform.world.rotation).toBeCloseTo(2.5);
  });

  it('Does not rotate locked bodies', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const actor = createDynamicBody({ lockRotation: true });
    const rigidBody = actor.getComponent(RigidBody);
    const transform = actor.getComponent(Transform);

    rigidBody.angularVelocity = 10;
    rigidBody.applyTorque(10);
    scene.appendChild(actor);

    physicsSystem.fixedUpdate({ deltaTime: 1000 });

    expect(rigidBody.angularVelocity).toBeCloseTo(0);
    expect(transform.world.rotation).toBeCloseTo(0);
  });
});
