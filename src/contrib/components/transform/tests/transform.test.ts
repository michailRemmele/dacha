import uuid from 'uuid-random';

import { MathOps } from '../../../../engine/math-lib';
import { Actor } from '../../../../engine/actor';
import { Transform } from '../index';

const EPS = 1e-6;

const expectClose = (a: number, b: number, eps = EPS): void => {
  expect(Math.abs(a - b)).toBeLessThan(eps);
};

const makeActor = (parent?: Actor): Actor => {
  const id = uuid();
  const actor = new Actor({ id, name: id });

  if (parent) {
    parent.appendChild(actor);
  }
  return actor;
};

describe('Contrib -> components -> Transform', () => {
  it('child inherits parent translation', () => {
    const parent = makeActor();
    const parentTransform = parent.getComponent(Transform);
    parentTransform.local.position.x = 100;
    parentTransform.local.position.y = 50;

    const child = makeActor(parent);
    const childTransform = child.getComponent(Transform);
    childTransform.local.position.x = 10;
    childTransform.local.position.y = 5;

    expectClose(childTransform.world.position.x, 110);
    expectClose(childTransform.world.position.y, 55);
  });

  it('child inherits parent rotation', () => {
    const parent = makeActor();
    const parentTransform = parent.getComponent(Transform);
    parentTransform.local.rotation = MathOps.degToRad(90);

    const child = makeActor(parent);
    const childTransform = child.getComponent(Transform);
    childTransform.local.position.x = 10;
    childTransform.local.position.y = 0;

    expectClose(childTransform.world.position.x, 0);
    expectClose(childTransform.world.position.y, 10);
    expectClose(childTransform.world.rotation, MathOps.degToRad(90));
  });

  it('rotation accumulates across full hierarchy', () => {
    const grandParent = makeActor();
    const grandParentTransform = grandParent.getComponent(Transform);
    grandParentTransform.local.rotation = MathOps.degToRad(10);

    const parent = makeActor(grandParent);
    const parentTransform = parent.getComponent(Transform);
    parentTransform.local.rotation = MathOps.degToRad(20);

    const child = makeActor(parent);
    const childTransform = child.getComponent(Transform);
    childTransform.local.rotation = MathOps.degToRad(30);

    expectClose(parentTransform.world.rotation, MathOps.degToRad(30));
    expectClose(childTransform.world.rotation, MathOps.degToRad(60));
  });

  it('child inherits parent scale', () => {
    const parent = makeActor();
    const parentTransform = parent.getComponent(Transform);
    parentTransform.local.scale.x = 2;
    parentTransform.local.scale.y = 3;

    const child = makeActor(parent);
    const childTransform = child.getComponent(Transform);
    childTransform.local.position.x = 5;
    childTransform.local.position.y = 4;

    expectClose(childTransform.world.position.x, 10);
    expectClose(childTransform.world.position.y, 12);
    expectClose(childTransform.world.scale.x, 2);
    expectClose(childTransform.world.scale.y, 3);
  });

  it('scale accumulates across full hierarchy', () => {
    const grandParent = makeActor();
    const grandParentTransform = grandParent.getComponent(Transform);
    grandParentTransform.local.scale.x = 2;
    grandParentTransform.local.scale.y = 2;

    const parent = makeActor(grandParent);
    const parentTransform = parent.getComponent(Transform);
    parentTransform.local.scale.x = 3;
    parentTransform.local.scale.y = 4;

    const child = makeActor(parent);
    const childTransform = child.getComponent(Transform);
    childTransform.local.scale.x = 5;
    childTransform.local.scale.y = 6;

    expectClose(parentTransform.world.scale.x, 6);
    expectClose(parentTransform.world.scale.y, 8);
    expectClose(childTransform.world.scale.x, 30);
    expectClose(childTransform.world.scale.y, 48);
  });

  it('combined translation + rotation + scale', () => {
    const parent = makeActor();
    const parentTransform = parent.getComponent(Transform);
    parentTransform.local.position.x = 100;
    parentTransform.local.rotation = MathOps.degToRad(90);
    parentTransform.local.scale.x = 2;
    parentTransform.local.scale.y = 2;

    const child = makeActor(parent);
    const childTransform = child.getComponent(Transform);
    childTransform.local.position.x = 5;
    childTransform.local.position.y = 0;

    expectClose(childTransform.world.position.x, 100);
    expectClose(childTransform.world.position.y, 10);
  });

  it('deep hierarchy rotation propagation', () => {
    const grandParent = makeActor();
    const grandParentTransform = grandParent.getComponent(Transform);
    grandParentTransform.local.rotation = MathOps.degToRad(90);

    const parent = makeActor(grandParent);
    const parentTransform = parent.getComponent(Transform);
    parentTransform.local.position.x = 10;
    parentTransform.local.rotation = MathOps.degToRad(90);

    const child = makeActor(parent);
    const childTransform = child.getComponent(Transform);
    childTransform.local.position.x = 5;

    expectClose(parentTransform.world.position.x, 0);
    expectClose(parentTransform.world.position.y, 10);

    expectClose(childTransform.world.position.x, -5);
    expectClose(childTransform.world.position.y, 10);
  });

  it('world position update overrides current world position (update X, preserve Y)', () => {
    const parent = makeActor();
    const parentTransform = parent.getComponent(Transform);
    parentTransform.local.rotation = MathOps.degToRad(90);

    const child = makeActor(parent);
    const childTransform = child.getComponent(Transform);

    childTransform.local.position.x = 20;
    childTransform.local.position.y = 5;

    expectClose(childTransform.world.position.x, -5);
    expectClose(childTransform.world.position.y, 20);

    childTransform.world.position.x = 10;

    expectClose(childTransform.world.position.x, 10);
    expectClose(childTransform.world.position.y, 20);
  });

  it('world position update overrides current world position (update Y, preserve X)', () => {
    const parent = makeActor();
    const parentTransform = parent.getComponent(Transform);
    parentTransform.local.position.x = 100;
    parentTransform.local.rotation = MathOps.degToRad(90);
    parentTransform.local.scale.x = 2;
    parentTransform.local.scale.y = 2;

    const child = makeActor(parent);
    const childTransform = child.getComponent(Transform);

    childTransform.local.position.x = 50;
    childTransform.local.position.y = 0;

    expectClose(childTransform.world.position.x, 100);
    expectClose(childTransform.world.position.y, 100);

    childTransform.world.position.y = 10;

    expectClose(childTransform.world.position.x, 100);
    expectClose(childTransform.world.position.y, 10);
  });

  it('changing parent invalidates child', () => {
    const grandParent = makeActor();
    const grandParentTransform = grandParent.getComponent(Transform);

    const parent = makeActor(grandParent);
    const parentTransform = parent.getComponent(Transform);

    const child = makeActor(parent);
    const childTransform = child.getComponent(Transform);

    expectClose(parentTransform.world.position.x, 0);
    expectClose(childTransform.world.position.x, 0);

    grandParentTransform.local.position.x = 100;

    expectClose(parentTransform.world.position.x, 100);
    expectClose(childTransform.world.position.x, 100);

    parentTransform.local.position.x = 50;

    expectClose(childTransform.world.position.x, 150);
  });

  it('set local rotation in degrees updates rotation in radians', () => {
    const actor = makeActor();
    const actorTransform = actor.getComponent(Transform);

    actorTransform.local.rotationDeg = 180;

    expectClose(actorTransform.local.rotation, Math.PI);
    expectClose(actorTransform.local.rotationDeg, 180);
  });

  it('set rotation in degrees accumulates through hierarchy', () => {
    const parent = makeActor();
    const parentTransform = parent.getComponent(Transform);

    parentTransform.local.rotationDeg = 30;

    const child = makeActor(parent);
    const childTransform = child.getComponent(Transform);

    childTransform.local.rotationDeg = 15;

    expectClose(childTransform.world.rotation, Math.PI / 4);
    expectClose(childTransform.world.rotationDeg, 45);
  });

  it('world rotation update overrides current world rotation', () => {
    const parent = makeActor();
    const parentTransform = parent.getComponent(Transform);

    parentTransform.local.rotationDeg = 30;

    const child = makeActor(parent);
    const childTransform = child.getComponent(Transform);

    childTransform.local.rotationDeg = 15;

    expectClose(childTransform.world.rotation, Math.PI / 4);
    expectClose(childTransform.world.rotationDeg, 45);

    childTransform.world.rotationDeg = 90;

    expectClose(childTransform.world.rotation, Math.PI / 2);
    expectClose(childTransform.world.rotationDeg, 90);
  });

  it('world scale update overrides current world scale', () => {
    const parent = makeActor();
    const parentTransform = parent.getComponent(Transform);

    parentTransform.local.scale.x = 2;
    parentTransform.local.scale.y = 1;

    const child = makeActor(parent);
    const childTransform = child.getComponent(Transform);

    childTransform.local.scale.x = 3;
    childTransform.local.scale.y = 2;

    expectClose(childTransform.world.scale.x, 6);
    expectClose(childTransform.world.scale.y, 2);

    childTransform.world.scale.x = 4;

    expectClose(childTransform.world.scale.x, 4);
    expectClose(childTransform.world.scale.y, 2);
  });
});
