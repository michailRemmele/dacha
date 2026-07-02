import { RigidBody } from '../../../components';
import { Transform } from '../../../components/transform';

import {
  createBoxActor,
  createCircleActor,
  createPhysicsSystem,
  createScene,
  createSegmentActor,
} from './helpers';

describe('Systems -> PhysicsSystem -> collision resolution', () => {
  it('Stops a falling body from continuing through a static floor', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const floor = createBoxActor('floor', 'static', 0, 3);
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
    expect(transform.world.position.y).toBeLessThanOrEqual(1.12);
  });

  it('Skips collision resolution when collision matrix disables a pair', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene, {
      collisionLayers: [
        { id: 'body', name: 'Body' },
        { id: 'floor', name: 'Floor' },
      ],
      collisionMatrix: {
        body: { floor: false },
        floor: { body: false },
      },
    });
    const floor = createBoxActor('floor', 'static', 0, 3, {
      layer: 'floor',
    });
    const body = createBoxActor('body', 'dynamic', 0, 0, {
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

  it('Resolves a falling circle against a static segment floor', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const floor = createSegmentActor('floor', 0, 3, -5, 0, 5, 0, 'static');
    const body = createCircleActor('body', 0, 0, 0.75);
    body.setComponent(
      new RigidBody({
        type: 'dynamic',
        mass: 1,
        gravityScale: 0,
        linearDamping: 0,
        disabled: false,
        oneWay: false,
      }),
    );
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    rigidBody.linearVelocity.y = 15;

    scene.appendChild(floor);
    scene.appendChild(body);

    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(rigidBody.linearVelocity.y).toBeCloseTo(0);
    expect(transform.world.position.y).toBeLessThanOrEqual(2.49);
  });
});
