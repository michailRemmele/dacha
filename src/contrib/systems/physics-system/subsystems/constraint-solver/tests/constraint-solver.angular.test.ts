import { Vector2 } from '../../../../../../engine/math-lib';
import { RigidBody } from '../../../../../components/rigid-body';
import { Transform } from '../../../../../components/transform';
import type { Contact } from '../../collision-detection/types';
import { ConstraintSolver } from '../index';

import { createActorWithInertia } from './helpers';

describe('PhysicsSystem -> ConstraintSolver -> angular impulses', () => {
  it('Applies angular velocity for off-center collisions', () => {
    const solver = new ConstraintSolver({
      getGravity: (): Vector2 => new Vector2(0, 0),
    });
    const actor1 = createActorWithInertia('dynamic-body', 'dynamic');
    const actor2 = createActorWithInertia('static-body', 'static');
    const rigidBody1 = actor1.getComponent(RigidBody);

    rigidBody1.linearVelocity = new Vector2(0, 10);

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(0, 1),
        penetration: 0,
        contactPoints: [{ x: 1, y: 0 }],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.y).toBeCloseTo(5);
    expect(rigidBody1.angularVelocity).toBeCloseTo(-5);
  });

  it('Does not apply angular velocity for center collisions', () => {
    const solver = new ConstraintSolver({
      getGravity: (): Vector2 => new Vector2(0, 0),
    });
    const actor1 = createActorWithInertia('dynamic-body', 'dynamic');
    const actor2 = createActorWithInertia('static-body', 'static');
    const rigidBody1 = actor1.getComponent(RigidBody);

    rigidBody1.linearVelocity = new Vector2(0, 10);

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(0, 1),
        penetration: 0,
        contactPoints: [{ x: 0, y: 0 }],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.y).toBeCloseTo(0);
    expect(rigidBody1.angularVelocity).toBeCloseTo(0);
  });

  it('Does not add angular velocity for symmetric two-point contacts', () => {
    const solver = new ConstraintSolver({
      getGravity: (): Vector2 => new Vector2(0, 0),
    });
    const actor1 = createActorWithInertia('dynamic-body', 'dynamic');
    const actor2 = createActorWithInertia('static-body', 'static');
    const rigidBody1 = actor1.getComponent(RigidBody);

    rigidBody1.linearVelocity = new Vector2(0, 10);

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(0, 1),
        penetration: 0,
        contactPoints: [
          { x: -1, y: 0 },
          { x: 1, y: 0 },
        ],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.y).toBeCloseTo(0);
    expect(rigidBody1.angularVelocity).toBeCloseTo(0);
  });

  it('Pushes only the first point when the second is already separating', () => {
    const solver = new ConstraintSolver({
      getGravity: (): Vector2 => new Vector2(0, 0),
    });
    const actor1 = createActorWithInertia('dynamic-body', 'dynamic');
    const actor2 = createActorWithInertia('static-body', 'static');
    const rigidBody1 = actor1.getComponent(RigidBody);

    rigidBody1.linearVelocity = new Vector2(0, 1);
    rigidBody1.angularVelocity = -5;

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(0, 1),
        penetration: 0,
        contactPoints: [
          { x: -1, y: 0 },
          { x: 1, y: 0 },
        ],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.y).toBeCloseTo(-2);
    expect(rigidBody1.angularVelocity).toBeCloseTo(-2);
  });

  it('Pushes only the second point when the first is already separating', () => {
    const solver = new ConstraintSolver({
      getGravity: (): Vector2 => new Vector2(0, 0),
    });
    const actor1 = createActorWithInertia('dynamic-body', 'dynamic');
    const actor2 = createActorWithInertia('static-body', 'static');
    const rigidBody1 = actor1.getComponent(RigidBody);

    rigidBody1.linearVelocity = new Vector2(0, 1);
    rigidBody1.angularVelocity = 5;

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(0, 1),
        penetration: 0,
        contactPoints: [
          { x: -1, y: 0 },
          { x: 1, y: 0 },
        ],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.y).toBeCloseTo(-2);
    expect(rigidBody1.angularVelocity).toBeCloseTo(2);
  });

  it('Applies no impulse to a two-point contact separating at both points', () => {
    const solver = new ConstraintSolver({
      getGravity: (): Vector2 => new Vector2(0, 0),
    });
    const actor1 = createActorWithInertia('dynamic-body', 'dynamic');
    const actor2 = createActorWithInertia('static-body', 'static');
    const rigidBody1 = actor1.getComponent(RigidBody);

    rigidBody1.linearVelocity = new Vector2(0, -5);

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(0, 1),
        penetration: 0,
        contactPoints: [
          { x: -1, y: 0 },
          { x: 1, y: 0 },
        ],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.y).toBeCloseTo(-5);
    expect(rigidBody1.angularVelocity).toBeCloseTo(0);
  });

  it('Does not convert symmetric bouncy two-point friction into spin', () => {
    const solver = new ConstraintSolver({
      getGravity: (): Vector2 => new Vector2(0, 0),
    });
    const actor1 = createActorWithInertia('dynamic-body', 'dynamic', {
      friction: 0.6,
      restitution: 1,
    });
    const actor2 = createActorWithInertia('bouncy-floor', 'static', {
      friction: 0.6,
      restitution: 1,
    });
    const rigidBody1 = actor1.getComponent(RigidBody);
    const transform1 = actor1.getComponent(Transform);

    rigidBody1.inertia = (16 * 16 + 16 * 16) / 12;
    rigidBody1.linearVelocity = new Vector2(0, 529.2);
    rigidBody1._prevLinearVelocity = rigidBody1.linearVelocity.clone();
    transform1.world.position.x = -8;

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(0, 1),
        penetration: 0,
        contactPoints: [
          { x: 0, y: 8 },
          { x: -16, y: 8 },
        ],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.x).toBeCloseTo(0);
    expect(rigidBody1.linearVelocity.y).toBeCloseTo(-529.2);
    expect(rigidBody1.angularVelocity).toBeCloseTo(0);
  });

  it('Applies angular velocity from friction at the contact point', () => {
    const solver = new ConstraintSolver({
      getGravity: (): Vector2 => new Vector2(0, 0),
    });
    const actor1 = createActorWithInertia('sliding-body', 'dynamic');
    const actor2 = createActorWithInertia('floor', 'static');
    const rigidBody1 = actor1.getComponent(RigidBody);

    rigidBody1.linearVelocity = new Vector2(3, 1);

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(0, 1),
        penetration: 0,
        contactPoints: [{ x: 0, y: 1 }],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.x).toBeLessThan(3);
    expect(Math.abs(rigidBody1.angularVelocity)).toBeGreaterThan(0);
  });

  it('Uses contact-point angular velocity for restitution', () => {
    const solver = new ConstraintSolver({
      getGravity: (): Vector2 => new Vector2(0, 0),
    });
    const actor1 = createActorWithInertia('spinning-body', 'dynamic');
    const actor2 = createActorWithInertia('bouncy-floor', 'static', {
      restitution: 1,
    });
    const rigidBody1 = actor1.getComponent(RigidBody);

    rigidBody1.angularVelocity = 5;
    rigidBody1._prevAngularVelocity = 5;

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(0, 1),
        penetration: 0,
        contactPoints: [{ x: 1, y: 0 }],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.y).toBeLessThan(0);
    expect(rigidBody1.angularVelocity).toBeLessThan(5);
  });

  it('Does not apply angular velocity to locked rotation bodies', () => {
    const solver = new ConstraintSolver({
      getGravity: (): Vector2 => new Vector2(0, 0),
    });
    const actor1 = createActorWithInertia('dynamic-body', 'dynamic', {
      lockRotation: true,
    });
    const actor2 = createActorWithInertia('static-body', 'static');
    const rigidBody1 = actor1.getComponent(RigidBody);
    const transform1 = actor1.getComponent(Transform);

    rigidBody1.linearVelocity = new Vector2(0, 10);
    transform1.world.position.y = 2;

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(0, 1),
        penetration: 0,
        contactPoints: [{ x: 1, y: 0 }],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.y).toBeCloseTo(0);
    expect(rigidBody1.angularVelocity).toBeCloseTo(0);
  });
});
