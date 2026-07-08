import { Vector2 } from '../../../../engine/math-lib';
import { RigidBody } from '../../../components';
import { Transform } from '../../../components/transform';

import { createBoxActor, createPhysicsSystem, createScene } from './helpers';

describe('Systems -> PhysicsSystem -> sleeping', () => {
  it('Automatically sleeps a dynamic body resting on a static floor', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene, undefined, 10);
    const floor = createBoxActor('floor', 'static', 0, 2);
    const body = createBoxActor('body', 'dynamic', 0, 0);
    const rigidBody = body.getComponent(RigidBody);

    rigidBody.gravityScale = 1;

    scene.appendChild(floor);
    scene.appendChild(body);

    for (let i = 0; i < 10; i += 1) {
      physicsSystem.fixedUpdate({ deltaTime: 100 });
    }

    expect(rigidBody.sleeping).toBe(true);
    expect(rigidBody.linearVelocity.equals(new Vector2(0, 0))).toBe(true);
    expect(rigidBody.angularVelocity).toBe(0);
  });

  it('Wakes a sleeping body when force, impulse, torque, or angular impulse is applied', () => {
    const rigidBody = new RigidBody({
      type: 'dynamic',
      mass: 1,
      disabled: false,
      oneWay: false,
    });

    rigidBody.sleep();
    rigidBody.applyForce(new Vector2(1, 0));
    expect(rigidBody.sleeping).toBe(false);

    rigidBody.sleep();
    rigidBody.applyImpulse(new Vector2(1, 0));
    expect(rigidBody.sleeping).toBe(false);

    rigidBody.sleep();
    rigidBody.applyTorque(1);
    expect(rigidBody.sleeping).toBe(false);

    rigidBody.sleep();
    rigidBody.applyAngularImpulse(1);
    expect(rigidBody.sleeping).toBe(false);
  });

  it('Requires explicit wakeUp after direct velocity writes', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const body = createBoxActor('body', 'dynamic', 0, 0);
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    rigidBody.sleep();
    rigidBody.linearVelocity.x = 1;

    scene.appendChild(body);

    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(rigidBody.sleeping).toBe(true);
    expect(transform.world.position.x).toBeCloseTo(0);

    rigidBody.wakeUp();
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(rigidBody.sleeping).toBe(false);
    expect(transform.world.position.x).toBeCloseTo(0.1);
  });

  it('Does not automatically sleep bodies with autoSleep disabled', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const body = createBoxActor('body', 'dynamic', 0, 0);
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    rigidBody.autoSleep = false;
    rigidBody.linearVelocity.x = 1;

    scene.appendChild(body);

    for (let i = 0; i < 10; i += 1) {
      physicsSystem.fixedUpdate({ deltaTime: 100 });
    }

    expect(rigidBody.sleeping).toBe(false);
    expect(transform.world.position.x).toBeCloseTo(1);
  });

  it('Wakes and moves a sleeping dynamic body pushed by a kinematic body', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const pusher = createBoxActor('pusher', 'kinematic', -3, 0);
    const body = createBoxActor('body', 'dynamic', 0, 0);
    const pusherBody = pusher.getComponent(RigidBody);
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    rigidBody.sleep();

    scene.appendChild(pusher);
    scene.appendChild(body);

    pusherBody.movePosition(new Vector2(-1.5, 0));
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(rigidBody.sleeping).toBe(false);
    expect(transform.world.position.x).toBeGreaterThan(0);
  });

  it('Keeps a sleeping dynamic body asleep on a slow contact', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const pusher = createBoxActor('pusher', 'kinematic', -2.05, 0);
    const body = createBoxActor('body', 'dynamic', 0, 0);
    const pusherBody = pusher.getComponent(RigidBody);
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    rigidBody.sleep();

    scene.appendChild(pusher);
    scene.appendChild(body);

    pusherBody.movePosition(new Vector2(-1.95, 0));
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(rigidBody.sleeping).toBe(true);
    expect(transform.world.position.x).toBeCloseTo(0);
  });

  it('Wakes before dynamic integration when solver bias corrects deep penetration', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const floor = createBoxActor('floor', 'static', 0, 1.2);
    const body = createBoxActor('body', 'dynamic', 0, 0);
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    rigidBody.sleep();

    scene.appendChild(floor);
    scene.appendChild(body);

    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(rigidBody.sleeping).toBe(false);
    expect(transform.world.position.y).toBeLessThan(-0.01);
  });

  it('Sleeps dynamic bodies independently when they are below thresholds', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const body1 = createBoxActor('body-1', 'dynamic', 0, 0);
    const body2 = createBoxActor('body-2', 'dynamic', 1.95, 0);
    const rigidBody1 = body1.getComponent(RigidBody);
    const rigidBody2 = body2.getComponent(RigidBody);

    scene.appendChild(body1);
    scene.appendChild(body2);

    for (let i = 0; i < 10; i += 1) {
      physicsSystem.fixedUpdate({ deltaTime: 100 });
    }

    expect(rigidBody1.sleeping).toBe(true);
    expect(rigidBody2.sleeping).toBe(true);

    rigidBody1.wakeUp();

    for (let i = 0; i < 10; i += 1) {
      physicsSystem.fixedUpdate({ deltaTime: 100 });
    }

    expect(rigidBody1.sleeping).toBe(true);
    expect(rigidBody2.sleeping).toBe(true);
  });

  it('Wakes a sleeping dynamic body when it loses its support contact', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene, undefined, 10);
    const floor = createBoxActor('floor', 'static', 0, 2);
    const body = createBoxActor('body', 'dynamic', 0, 0);
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    rigidBody.gravityScale = 1;

    scene.appendChild(floor);
    scene.appendChild(body);

    for (let i = 0; i < 10; i += 1) {
      physicsSystem.fixedUpdate({ deltaTime: 100 });
    }

    expect(rigidBody.sleeping).toBe(true);

    const supportedPositionY = transform.world.position.y;

    scene.removeChild(floor);
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(rigidBody.sleeping).toBe(false);
    expect(transform.world.position.y).toBeCloseTo(supportedPositionY);

    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(transform.world.position.y).toBeGreaterThan(supportedPositionY);
  });

  it('Keeps a sleeping dynamic body asleep when a side contact is removed but support remains', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene, undefined, 10);
    const floor = createBoxActor('floor', 'static', 0, 2);
    const wall = createBoxActor('wall', 'static', 2, 0);
    const body = createBoxActor('body', 'dynamic', 0, 0);
    const rigidBody = body.getComponent(RigidBody);

    rigidBody.gravityScale = 1;

    scene.appendChild(floor);
    scene.appendChild(wall);
    scene.appendChild(body);

    for (let i = 0; i < 10; i += 1) {
      physicsSystem.fixedUpdate({ deltaTime: 100 });
    }

    expect(rigidBody.sleeping).toBe(true);

    scene.removeChild(wall);
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(rigidBody.sleeping).toBe(true);
  });

  it('Keeps a sleeping dynamic body asleep on a fast contact when linearSleepThreshold is raised', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene, undefined, 0, 0, {
      linearSleepThreshold: 5,
    });
    const pusher = createBoxActor('pusher', 'kinematic', -2.2, 0);
    const body = createBoxActor('body', 'dynamic', 0, 0);
    const pusherBody = pusher.getComponent(RigidBody);
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    rigidBody.sleep();

    scene.appendChild(pusher);
    scene.appendChild(body);

    pusherBody.movePosition(new Vector2(-1.9, 0));
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(rigidBody.sleeping).toBe(true);
    expect(transform.world.position.x).toBeCloseTo(0);
  });

  it('Still sleeps a body resting at a raised maxAllowedPenetration without thrashing', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene, undefined, 10, 0, {
      maxAllowedPenetration: 1,
    });
    const floor = createBoxActor('floor', 'static', 0, 2);
    const body = createBoxActor('body', 'dynamic', 0, 0);
    const rigidBody = body.getComponent(RigidBody);

    rigidBody.gravityScale = 1;

    scene.appendChild(floor);
    scene.appendChild(body);

    for (let i = 0; i < 10; i += 1) {
      physicsSystem.fixedUpdate({ deltaTime: 100 });
    }

    expect(rigidBody.sleeping).toBe(true);

    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(rigidBody.sleeping).toBe(true);
  });
});
