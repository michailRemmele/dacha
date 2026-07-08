import { RigidBody } from '../../../components';
import { Transform } from '../../../components/transform';

import { createBoxActor, createPhysicsSystem, createScene } from './helpers';

describe('Systems -> PhysicsSystem -> one-way collisions', () => {
  it('Stops a body that approaches a one-way floor from the solid side', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const floor = createBoxActor('floor', 'static', 0, 3, {
      layer: 'default',
      oneWay: true,
      oneWayNormalX: 0,
      oneWayNormalY: -1,
    });
    const body = createBoxActor('body', 'dynamic', 0, 0);
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    rigidBody.linearVelocity.y = 15;

    scene.appendChild(floor);
    scene.appendChild(body);

    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(rigidBody.linearVelocity.y).toBeLessThanOrEqual(0);
    expect(Math.abs(rigidBody.angularVelocity)).toBeLessThan(0.02);
    expect(transform.world.position.y).toBeLessThanOrEqual(1.51);
  });

  it('Lets a body pass through a one-way floor from the open side', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const floor = createBoxActor('floor', 'static', 0, 0, {
      layer: 'default',
      oneWay: true,
      oneWayNormalX: 0,
      oneWayNormalY: -1,
    });
    const body = createBoxActor('body', 'dynamic', 0, 4);
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    rigidBody.linearVelocity.y = -15;

    scene.appendChild(floor);
    scene.appendChild(body);

    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(rigidBody.linearVelocity.y).toBeCloseTo(-15);
    expect(transform.world.position.y).toBeCloseTo(-2);
  });

  it('Keeps ignoring a one-way overlap until the bodies separate', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const floor = createBoxActor('floor', 'static', 0, 0, {
      layer: 'default',
      oneWay: true,
      oneWayNormalX: 0,
      oneWayNormalY: -1,
    });
    const body = createBoxActor('body', 'dynamic', 0, 3);
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    rigidBody.linearVelocity.y = -15;

    scene.appendChild(floor);
    scene.appendChild(body);

    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(rigidBody.linearVelocity.y).toBeCloseTo(-15);
    expect(transform.world.position.y).toBeCloseTo(-1.5);
  });
});
