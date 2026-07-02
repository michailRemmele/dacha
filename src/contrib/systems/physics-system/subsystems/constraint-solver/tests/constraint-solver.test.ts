import { Actor } from '../../../../../../engine/actor';
import { Vector2 } from '../../../../../../engine/math-lib';
import {
  RigidBody,
  type RigidBodyConfig,
  type RigidBodyType,
} from '../../../../../components/rigid-body';
import { Transform } from '../../../../../components/transform';
import { ConstraintSolver } from '../index';
import type { Contact } from '../../collision-detection/types';

const createActor = (
  id: string,
  type: RigidBodyType,
  config: Partial<RigidBodyConfig> = {},
): Actor => {
  const actor = new Actor({ id, name: id });

  actor.setComponent(
    new RigidBody({
      type,
      mass: 1,
      gravityScale: 0,
      linearDamping: 0,
      disabled: false,
      oneWay: false,
      ...config,
    }),
  );

  return actor;
};

describe('PhysicsSystem -> ConstraintSolver', () => {
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

  it('Removes relative normal velocity between equal-mass dynamic bodies', () => {
    const solver = new ConstraintSolver();
    const actor1 = createActor('body-1', 'dynamic');
    const actor2 = createActor('body-2', 'dynamic');
    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);

    rigidBody1.linearVelocity = new Vector2(1, 0);
    rigidBody2.linearVelocity = new Vector2(-1, 0);

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(1, 0),
        penetration: 0.25,
        contactPoints: [{ x: 0, y: 0 }],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.x).toBeCloseTo(0);
    expect(rigidBody2.linearVelocity.x).toBeCloseTo(0);
  });

  it('Reduces tangential sliding velocity when contact has closing normal velocity', () => {
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
        penetration: 0.2,
        contactPoints: [{ x: 0, y: 0 }],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.x).toBeLessThan(3);
    expect(rigidBody1.linearVelocity.y).toBeCloseTo(0, 2);
  });

  it('Uses static body restitution to bounce dynamic bodies', () => {
    const solver = new ConstraintSolver();
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
    const solver = new ConstraintSolver();
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

  it('Uses body friction values for contact friction', () => {
    const solver = new ConstraintSolver();
    const actor1 = createActor('sliding-body', 'dynamic', {
      mass: 1,
      friction: 0,
    });
    const actor2 = createActor('frictionless-floor', 'static', {
      mass: 1,
      friction: 1,
    });
    const rigidBody1 = actor1.getComponent(RigidBody);

    rigidBody1.linearVelocity = new Vector2(3, 1);

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

    expect(rigidBody1.linearVelocity.x).toBeCloseTo(3);
    expect(rigidBody1.linearVelocity.y).toBeCloseTo(0);
  });

  it('Does not apply wall friction without a closing normal velocity', () => {
    const solver = new ConstraintSolver();
    const actor1 = createActor('body', 'dynamic');
    const actor2 = createActor('wall', 'static');
    const rigidBody1 = actor1.getComponent(RigidBody);

    rigidBody1.linearVelocity = new Vector2(0, 2);

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(1, 0),
        penetration: 0.2,
        contactPoints: [{ x: 0, y: 0 }],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.x).toBeCloseTo(0);
    expect(rigidBody1.linearVelocity.y).toBeCloseTo(2);
  });

  it('Cancels dynamic velocity against a kinematic body without moving the kinematic body', () => {
    const solver = new ConstraintSolver();

    const actor1 = createActor('dynamic-body', 'dynamic');
    const actor2 = createActor('kinematic-body', 'kinematic');

    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);
    const transform1 = actor1.getComponent(Transform);
    const transform2 = actor2.getComponent(Transform);

    rigidBody1.linearVelocity = new Vector2(5, 0);
    transform1.world.position.x = 2;
    transform2.world.position.x = 10;

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(1, 0),
        penetration: 0.5,
        contactPoints: [{ x: 0, y: 0 }],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.x).toBeCloseTo(0);
    expect(rigidBody2.linearVelocity.x).toBeCloseTo(0);
    expect(rigidBody1._biasLinearVelocity.x).toBeCloseTo(-3.2);
    expect(transform1.world.position.x).toBeCloseTo(2);
    expect(transform2.world.position.x).toBeCloseTo(10);
  });

  it('Does not apply cached impulses with the wrong sign after actor order reverses', () => {
    const solver = new ConstraintSolver();

    const dynamicActor = createActor('dynamic-body', 'dynamic');
    const staticActor = createActor('static-body', 'static');
    const rigidBody = dynamicActor.getComponent(RigidBody);

    rigidBody.linearVelocity = new Vector2(0, 5);

    solver.update(
      [
        {
          actor1: dynamicActor,
          actor2: staticActor,
          normal: new Vector2(0, 1),
          penetration: 0,
          contactPoints: [{ x: 0, y: 0 }],
        },
      ],
      { deltaTime: 100 },
    );

    expect(rigidBody.linearVelocity.y).toBeCloseTo(0);

    rigidBody.linearVelocity = new Vector2(0, 0);

    solver.update(
      [
        {
          actor1: staticActor,
          actor2: dynamicActor,
          normal: new Vector2(0, -1),
          penetration: 0,
          contactPoints: [{ x: 0, y: 0 }],
        },
      ],
      { deltaTime: 100 },
    );

    expect(rigidBody.linearVelocity.y).toBeCloseTo(0);
  });

  it('Lets moving kinematic bodies push dynamic bodies', () => {
    const solver = new ConstraintSolver();

    const actor1 = createActor('kinematic-body', 'kinematic');
    const actor2 = createActor('dynamic-body', 'dynamic');

    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);
    const transform1 = actor1.getComponent(Transform);
    const transform2 = actor2.getComponent(Transform);

    rigidBody1.linearVelocity = new Vector2(5, 0);
    transform1.world.position.x = 0;
    transform2.world.position.x = 2;

    const contacts: Contact[] = [
      {
        actor1,
        actor2,
        normal: new Vector2(1, 0),
        penetration: 0.5,
        contactPoints: [{ x: 0, y: 0 }],
      },
    ];

    solver.update(contacts, { deltaTime: 100 });

    expect(rigidBody1.linearVelocity.x).toBeCloseTo(5);
    expect(rigidBody2.linearVelocity.x).toBeCloseTo(5);
    expect(rigidBody2._biasLinearVelocity.x).toBeCloseTo(3.2);
    expect(transform1.world.position.x).toBeCloseTo(0);
    expect(transform2.world.position.x).toBeCloseTo(2);
  });
});
