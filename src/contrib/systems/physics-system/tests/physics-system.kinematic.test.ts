import { Vector2 } from '../../../../engine/math-lib';
import { RigidBody } from '../../../components';
import { Transform } from '../../../components/transform';

import { createBoxActor, createPhysicsSystem, createScene } from './helpers';

describe('Systems -> PhysicsSystem -> kinematic bodies', () => {
  it('Keeps moving a kinematic body by linear velocity until velocity is reset', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const body = createBoxActor('body', 'kinematic', 0, 0);
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    rigidBody.linearVelocity.x = 10;

    scene.appendChild(body);

    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(transform.world.position.x).toBeCloseTo(3);
    expect(rigidBody.linearVelocity.x).toBeCloseTo(10);

    rigidBody.linearVelocity.multiplyNumber(0);
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(transform.world.position.x).toBeCloseTo(3);
    expect(rigidBody.linearVelocity.x).toBeCloseTo(0);
  });

  it('Ignores force, impulse, and gravity for kinematic bodies', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene, undefined, 10);
    const body = createBoxActor('body', 'kinematic', 0, 0);
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    rigidBody.applyForce(new Vector2(100, 100));
    rigidBody.applyImpulse(new Vector2(100, 100));

    scene.appendChild(body);

    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(transform.world.position.x).toBeCloseTo(0);
    expect(transform.world.position.y).toBeCloseTo(0);
    expect(rigidBody.linearVelocity.equals(new Vector2(0, 0))).toEqual(true);
  });

  it('Moves a kinematic body to movePosition target for one fixed update', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const body = createBoxActor('body', 'kinematic', 0, 0);
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    scene.appendChild(body);

    rigidBody.movePosition(new Vector2(5, 0));
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(transform.world.position.x).toBeCloseTo(5);
    expect(transform.world.position.y).toBeCloseTo(0);
    expect(rigidBody.linearVelocity.equals(new Vector2(0, 0))).toEqual(true);

    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(transform.world.position.x).toBeCloseTo(5);
  });
});
