import { Vector2 } from '../../../../../../engine/math-lib';
import { RigidBody } from '../../../../../components/rigid-body';
import type { Contact } from '../../collision-detection/types';
import { createTime } from '../../../tests/helpers';
import { ConstraintSolver } from '../index';

import { createActor } from './helpers';

describe('PhysicsSystem -> ConstraintSolver -> warm start', () => {
  it('Does not apply cached impulses with the wrong sign after actor order reverses', () => {
    const solver = new ConstraintSolver({
      time: createTime(),
      getGravity: (): Vector2 => new Vector2(0, 0),
    });

    const dynamicActor = createActor('dynamic-body', 'dynamic');
    const staticActor = createActor('static-body', 'static');
    const rigidBody = dynamicActor.getComponent(RigidBody);

    rigidBody.linearVelocity = new Vector2(0, 5);

    solver.update([
      {
        actor1: dynamicActor,
        actor2: staticActor,
        normal: new Vector2(0, 1),
        penetration: 0,
        contactPoints: [{ x: 0, y: 0 }],
      },
    ]);

    expect(rigidBody.linearVelocity.y).toBeCloseTo(0);

    rigidBody.linearVelocity = new Vector2(0, 0);

    solver.update([
      {
        actor1: staticActor,
        actor2: dynamicActor,
        normal: new Vector2(0, -1),
        penetration: 0,
        contactPoints: [{ x: 0, y: 0 }],
      },
    ]);

    expect(rigidBody.linearVelocity.y).toBeCloseTo(0);
  });

  it('Clears stale warm-start impulses for high-speed bouncy two-point contacts when the fast point is second', () => {
    const actor1 = createActor('dynamic-body', 'dynamic', {
      restitution: 1,
    });
    const actor2 = createActor('bouncy-floor', 'static', {
      mass: 1,
      restitution: 1,
    });
    const rigidBody1 = actor1.getComponent(RigidBody);
    const contact: Contact = {
      actor1,
      actor2,
      normal: new Vector2(0, 1),
      penetration: 0,
      contactPoints: [
        { x: -1, y: 0 },
        { x: 1, y: 0 },
      ],
    };
    const cachedSolver = new ConstraintSolver({
      time: createTime(),
      getGravity: (): Vector2 => new Vector2(0, 0),
    });
    const freshSolver = new ConstraintSolver({
      time: createTime(),
      getGravity: (): Vector2 => new Vector2(0, 0),
    });

    rigidBody1.inertia = 1;
    rigidBody1.linearVelocity = new Vector2(0, 5);
    cachedSolver.update([contact]);

    const freshActor1 = createActor('fresh-dynamic-body', 'dynamic', {
      restitution: 1,
    });
    const freshActor2 = createActor('fresh-bouncy-floor', 'static', {
      mass: 1,
      restitution: 1,
    });
    const freshRigidBody1 = freshActor1.getComponent(RigidBody);
    const freshContact: Contact = {
      actor1: freshActor1,
      actor2: freshActor2,
      normal: new Vector2(0, 1),
      penetration: 0,
      contactPoints: [
        { x: -1, y: 0 },
        { x: 1, y: 0 },
      ],
    };

    rigidBody1.linearVelocity = new Vector2(0, 0);
    rigidBody1.angularVelocity = 5;
    rigidBody1._prevLinearVelocity = new Vector2(0, 0);
    rigidBody1._prevAngularVelocity = 5;

    freshRigidBody1.inertia = 1;
    freshRigidBody1.linearVelocity = new Vector2(0, 0);
    freshRigidBody1.angularVelocity = 5;
    freshRigidBody1._prevLinearVelocity = new Vector2(0, 0);
    freshRigidBody1._prevAngularVelocity = 5;

    cachedSolver.update([contact]);
    freshSolver.update([freshContact]);

    expect(rigidBody1.linearVelocity.y).toBeCloseTo(
      freshRigidBody1.linearVelocity.y,
    );
    expect(rigidBody1.angularVelocity).toBeCloseTo(
      freshRigidBody1.angularVelocity,
    );
  });
});
