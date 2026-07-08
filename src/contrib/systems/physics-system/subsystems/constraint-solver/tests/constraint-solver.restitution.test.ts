import { Vector2 } from '../../../../../../engine/math-lib';
import { RigidBody } from '../../../../../components/rigid-body';
import type { Contact } from '../../collision-detection/types';
import { ConstraintSolver } from '../index';

import { createActor } from './helpers';

describe('PhysicsSystem -> ConstraintSolver -> restitution', () => {
  it('Uses static body restitution to bounce dynamic bodies', () => {
    const solver = new ConstraintSolver({
      getGravity: (): Vector2 => new Vector2(0, 0),
    });
    const actor1 = createActor('dynamic-body', 'dynamic');
    const actor2 = createActor('bouncy-floor', 'static', {
      mass: 1,
      restitution: 1,
    });
    const rigidBody1 = actor1.getComponent(RigidBody);

    rigidBody1.linearVelocity = new Vector2(0, 5);
    rigidBody1._prevLinearVelocity = rigidBody1.linearVelocity.clone();

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(0, 1),
        penetration: 0.2,
        contactPoints: [{ x: 0, y: 0 }],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.y).toBeCloseTo(-5);
  });

  it('Suppresses restitution for low-speed contacts', () => {
    const solver = new ConstraintSolver({
      getGravity: (): Vector2 => new Vector2(0, 0),
    });
    const actor1 = createActor('dynamic-body', 'dynamic');
    const actor2 = createActor('bouncy-floor', 'static', {
      mass: 1,
      restitution: 1,
    });
    const rigidBody1 = actor1.getComponent(RigidBody);

    rigidBody1.linearVelocity = new Vector2(0, 0.5);
    rigidBody1._prevLinearVelocity = rigidBody1.linearVelocity.clone();

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(0, 1),
        penetration: 0.2,
        contactPoints: [{ x: 0, y: 0 }],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.y).toBeCloseTo(0);
  });

  it('Applies friction during a bounce using the full normal impulse', () => {
    const solver = new ConstraintSolver({
      getGravity: (): Vector2 => new Vector2(0, 0),
    });
    const actor1 = createActor('sliding-body', 'dynamic', {
      friction: 1,
      restitution: 1,
    });
    const actor2 = createActor('bouncy-floor', 'static', {
      mass: 1,
      friction: 1,
      restitution: 1,
    });
    const rigidBody1 = actor1.getComponent(RigidBody);

    rigidBody1.linearVelocity = new Vector2(7, 5);
    rigidBody1._prevLinearVelocity = rigidBody1.linearVelocity.clone();

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(0, 1),
        penetration: 0.2,
        contactPoints: [{ x: 0, y: 0 }],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.y).toBeCloseTo(-5);
    expect(rigidBody1.linearVelocity.x).toBeCloseTo(0);
  });
});
