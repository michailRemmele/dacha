import { Actor } from '../../../../../../engine/actor';
import { Vector2 } from '../../../../../../engine/math-lib';
import { RigidBody } from '../../../../../components/rigid-body';
import { Transform } from '../../../../../components/transform';
import { ConstraintSolver } from '../index';
import type { Contact } from '../../collision-detection/types';

const createActor = (
  id: string,
  type: 'dynamic' | 'static',
  mass = 1,
): Actor => {
  const actor = new Actor({ id, name: id });

  actor.setComponent(new RigidBody({
    type,
    mass,
    gravityScale: 0,
    linearDamping: 0,
    disabled: false,
  }));

  return actor;
};

describe('PhysicsSystem -> ConstraintSolver', () => {
  it('Cancels approaching normal velocity against a static body and corrects penetration', () => {
    const solver = new ConstraintSolver();
    const actor1 = createActor('dynamic-body', 'dynamic');
    const actor2 = createActor('static-body', 'static');
    const rigidBody1 = actor1.getComponent(RigidBody);
    const transform1 = actor1.getComponent(Transform);

    rigidBody1.linearVelocity = new Vector2(0, 5);
    transform1.world.position.y = 2;

    const contacts: Contact[] = [{
      actor1,
      actor2,
      normal: new Vector2(0, 1),
      penetration: 0.5,
      contactPoints: [{ x: 0, y: 0 }],
    }];

    solver.update(contacts);

    expect(rigidBody1.linearVelocity.y).toBeCloseTo(0);
    expect(transform1.world.position.y).toBeLessThan(2);
  });

  it('Removes relative normal velocity between equal-mass dynamic bodies', () => {
    const solver = new ConstraintSolver();
    const actor1 = createActor('body-1', 'dynamic');
    const actor2 = createActor('body-2', 'dynamic');
    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);

    rigidBody1.linearVelocity = new Vector2(1, 0);
    rigidBody2.linearVelocity = new Vector2(-1, 0);

    const contacts: Contact[] = [{
      actor1,
      actor2,
      normal: new Vector2(1, 0),
      penetration: 0.25,
      contactPoints: [{ x: 0, y: 0 }],
    }];

    solver.update(contacts);

    expect(rigidBody1.linearVelocity.x).toBeCloseTo(0);
    expect(rigidBody2.linearVelocity.x).toBeCloseTo(0);
  });
});
