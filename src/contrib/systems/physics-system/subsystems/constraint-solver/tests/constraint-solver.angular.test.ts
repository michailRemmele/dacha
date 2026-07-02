import { Actor } from '../../../../../../engine/actor';
import { Vector2 } from '../../../../../../engine/math-lib';
import {
  RigidBody,
  type RigidBodyConfig,
  type RigidBodyType,
} from '../../../../../components/rigid-body';
import { Transform } from '../../../../../components/transform';
import type { Contact } from '../../collision-detection/types';
import { ConstraintSolver } from '../index';

const createActor = (
  id: string,
  type: RigidBodyType,
  config: Partial<RigidBodyConfig> = {},
): Actor => {
  const actor = new Actor({ id, name: id });

  const rigidBody = new RigidBody({
    type,
    mass: 1,
    gravityScale: 0,
    linearDamping: 0,
    disabled: false,
    oneWay: false,
    ...config,
  });

  rigidBody.inertia = 1;
  actor.setComponent(rigidBody);

  return actor;
};

describe('PhysicsSystem -> ConstraintSolver -> angular impulses', () => {
  it('Applies angular velocity for off-center collisions', () => {
    const solver = new ConstraintSolver();
    const actor1 = createActor('dynamic-body', 'dynamic');
    const actor2 = createActor('static-body', 'static');
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
    const solver = new ConstraintSolver();
    const actor1 = createActor('dynamic-body', 'dynamic');
    const actor2 = createActor('static-body', 'static');
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
    const solver = new ConstraintSolver();
    const actor1 = createActor('dynamic-body', 'dynamic');
    const actor2 = createActor('static-body', 'static');
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

  it('Applies angular velocity from friction at the contact point', () => {
    const solver = new ConstraintSolver();
    const actor1 = createActor('sliding-body', 'dynamic');
    const actor2 = createActor('floor', 'static');
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
    const solver = new ConstraintSolver();
    const actor1 = createActor('spinning-body', 'dynamic');
    const actor2 = createActor('bouncy-floor', 'static', {
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
    const solver = new ConstraintSolver();
    const actor1 = createActor('dynamic-body', 'dynamic', {
      lockRotation: true,
    });
    const actor2 = createActor('static-body', 'static');
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
