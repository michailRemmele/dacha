import { Vector2 } from '../../../../../../engine/math-lib';
import { RigidBody } from '../../../../../components/rigid-body';
import { Transform } from '../../../../../components/transform';
import type { Contact } from '../../collision-detection/types';
import { ConstraintSolver } from '../index';

import { createActor } from './helpers';

describe('PhysicsSystem -> ConstraintSolver -> bias', () => {
  it('Cancels approaching normal velocity against a static body and adds separation bias', () => {
    const solver = new ConstraintSolver();
    const actor1 = createActor('dynamic-body', 'dynamic');
    const actor2 = createActor('static-body', 'static');
    const rigidBody1 = actor1.getComponent(RigidBody);
    const transform1 = actor1.getComponent(Transform);

    rigidBody1.linearVelocity = new Vector2(0, 5);
    transform1.world.position.y = 2;

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(0, 1),
        penetration: 0.5,
        contactPoints: [{ x: 0, y: 0 }],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.y).toBeCloseTo(0);
    expect(rigidBody1._biasLinearVelocity.y).toBeCloseTo(-3.2);
    expect(transform1.world.position.y).toBeCloseTo(2);
  });

  it('Resets accumulated bias impulses between solver updates', () => {
    const solver = new ConstraintSolver();
    const actor1 = createActor('dynamic-body', 'dynamic');
    const actor2 = createActor('static-body', 'static');
    const rigidBody1 = actor1.getComponent(RigidBody);

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(0, 1),
        penetration: 0.5,
        contactPoints: [{ x: 0, y: 0 }],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1._biasLinearVelocity.y).toBeCloseTo(-3.2);

    rigidBody1._biasLinearVelocity = new Vector2(0, 0);
    rigidBody1._biasAngularVelocity = 0;

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1._biasLinearVelocity.y).toBeCloseTo(-3.2);
  });

  it('Applies symmetric two-point bias without angular correction', () => {
    const solver = new ConstraintSolver();
    const actor1 = createActor('dynamic-body', 'dynamic');
    const actor2 = createActor('static-body', 'static');
    const rigidBody1 = actor1.getComponent(RigidBody);

    rigidBody1.inertia = 1;

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(0, 1),
        penetration: 0.5,
        contactPoints: [
          { x: -1, y: 0 },
          { x: 1, y: 0 },
        ],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1._biasLinearVelocity.y).toBeCloseTo(-3.2);
    expect(rigidBody1._biasAngularVelocity).toBeCloseTo(0);
  });

  it('Skips separation bias for high-speed bouncy dynamic-static contacts', () => {
    const solver = new ConstraintSolver();
    const actor1 = createActor('dynamic-body', 'dynamic');
    const actor2 = createActor('bouncy-floor', 'static', {
      mass: 1,
      restitution: 1,
    });
    const rigidBody1 = actor1.getComponent(RigidBody);
    const transform1 = actor1.getComponent(Transform);

    rigidBody1.linearVelocity = new Vector2(0, 5);
    rigidBody1._prevLinearVelocity = rigidBody1.linearVelocity.clone();
    transform1.world.position.y = 2;

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(0, 1),
        penetration: 0.5,
        contactPoints: [{ x: 0, y: 0 }],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.y).toBeCloseTo(-5);
    expect(rigidBody1._biasLinearVelocity.y).toBeCloseTo(0);
    expect(transform1.world.position.y).toBeCloseTo(2);
  });

  it('Skips separation bias for high-speed bouncy two-point contacts regardless of point order', () => {
    const solve = (contactPoints: Contact['contactPoints']): RigidBody => {
      const solver = new ConstraintSolver();
      const actor1 = createActor('dynamic-body', 'dynamic', {
        restitution: 1,
      });
      const actor2 = createActor('bouncy-floor', 'static', {
        mass: 1,
        restitution: 1,
      });
      const rigidBody1 = actor1.getComponent(RigidBody);

      rigidBody1.inertia = 1;
      rigidBody1.angularVelocity = 5;
      rigidBody1._prevAngularVelocity = 5;

      solver.update(
        [
          {
            actor1,
            actor2,
            normal: new Vector2(0, 1),
            penetration: 0.5,
            contactPoints,
          },
        ],
        { deltaTime: 100 },
      );

      return rigidBody1;
    };

    const fastPointSecondBody = solve([
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ]);
    const fastPointFirstBody = solve([
      { x: 1, y: 0 },
      { x: -1, y: 0 },
    ]);

    expect(fastPointSecondBody._biasLinearVelocity.y).toBeCloseTo(0);
    expect(fastPointSecondBody._biasAngularVelocity).toBeCloseTo(0);
    expect(fastPointFirstBody._biasLinearVelocity.y).toBeCloseTo(0);
    expect(fastPointFirstBody._biasAngularVelocity).toBeCloseTo(0);
  });

  it('Skips separation bias for high-speed bouncy dynamic-kinematic contacts', () => {
    const solver = new ConstraintSolver();
    const actor1 = createActor('dynamic-body', 'dynamic');
    const actor2 = createActor('bouncy-platform', 'kinematic', {
      mass: 1,
      restitution: 1,
    });
    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);

    rigidBody1.linearVelocity = new Vector2(0, 5);
    rigidBody1._prevLinearVelocity = rigidBody1.linearVelocity.clone();

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(0, 1),
        penetration: 0.5,
        contactPoints: [{ x: 0, y: 0 }],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.y).toBeCloseTo(-5);
    expect(rigidBody1._biasLinearVelocity.y).toBeCloseTo(0);
    expect(rigidBody2._biasLinearVelocity.y).toBeCloseTo(0);
  });

  it('Applies separation bias for bouncy dynamic-dynamic contacts', () => {
    const solver = new ConstraintSolver();
    const actor1 = createActor('body-1', 'dynamic', {
      mass: 1,
      restitution: 1,
    });
    const actor2 = createActor('body-2', 'dynamic', {
      mass: 1,
      restitution: 1,
    });
    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);

    rigidBody1.linearVelocity = new Vector2(0, 5);
    rigidBody2.linearVelocity = new Vector2(0, -5);
    rigidBody1._prevLinearVelocity = rigidBody1.linearVelocity.clone();
    rigidBody2._prevLinearVelocity = rigidBody2.linearVelocity.clone();

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(0, 1),
        penetration: 0.5,
        contactPoints: [{ x: 0, y: 0 }],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1._biasLinearVelocity.y).toBeCloseTo(-1.6);
    expect(rigidBody2._biasLinearVelocity.y).toBeCloseTo(1.6);
  });
});
