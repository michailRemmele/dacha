import { RigidBody } from '../index';
import { Vector2 } from '../../../../engine/math-lib';

describe('Contrib -> components -> RigidBody', () => {
  it('Returns correct values ', () => {
    const rigidBody = new RigidBody({
      type: 'dynamic',
      mass: 10,
      gravityScale: 1,
      linearDamping: 1,
      disabled: false,
      oneWay: false,
    });

    expect(rigidBody.type).toEqual('dynamic');
    expect(rigidBody.mass).toEqual(10);
    expect(rigidBody.inverseMass).toEqual(0.1);
    expect(rigidBody.gravityScale).toEqual(1);
    expect(rigidBody.linearDamping).toEqual(1);
    expect(rigidBody.linearVelocity.equals(new Vector2(0, 0))).toEqual(true);
    expect(rigidBody.disabled).toEqual(false);
    expect(rigidBody.oneWay).toEqual(false);
    expect(rigidBody.oneWayNormal).toBeUndefined();
    expect(rigidBody.sleeping).toEqual(false);
  });

  it('Normalizes one-way normals', () => {
    const rigidBody = new RigidBody({
      type: 'static',
      mass: 10,
      gravityScale: 1,
      linearDamping: 1,
      disabled: false,
      oneWay: true,
      oneWayNormalX: 0,
      oneWayNormalY: -10,
    });

    expect(rigidBody.oneWay).toEqual(true);
    expect(rigidBody.oneWayNormal?.x).toStrictEqual(0);
    expect(rigidBody.oneWayNormal?.y).toStrictEqual(-1);
  });

  it('Requires one-way rigid bodies to have a non-zero normal', () => {
    expect(
      () =>
        new RigidBody({
          type: 'static',
          mass: 10,
          gravityScale: 1,
          linearDamping: 1,
          disabled: false,
          oneWay: true,
          oneWayNormalX: 0,
          oneWayNormalY: 0,
        }),
    ).toThrow('One-way rigid body normal must be non-zero');
  });

  it('Correct updates values ', () => {
    const rigidBody = new RigidBody({
      type: 'dynamic',
      mass: 10,
      gravityScale: 1,
      linearDamping: 1,
      disabled: false,
      oneWay: false,
    });

    rigidBody.type = 'static';
    rigidBody.mass = 20;
    rigidBody.gravityScale = 0;
    rigidBody.linearDamping = 2;
    rigidBody.linearVelocity = new Vector2(1, 2);
    rigidBody.disabled = true;
    rigidBody.sleeping = true;

    expect(rigidBody.type).toEqual('static');
    expect(rigidBody.mass).toEqual(20);
    expect(rigidBody.inverseMass).toEqual(0.05);
    expect(rigidBody.gravityScale).toEqual(0);
    expect(rigidBody.linearDamping).toEqual(2);
    expect(rigidBody.linearVelocity.equals(new Vector2(1, 2))).toEqual(true);
    expect(rigidBody.disabled).toEqual(true);
    expect(rigidBody.sleeping).toEqual(true);
  });

  it('Sleep and wakeUp control sleeping state only', () => {
    const rigidBody = new RigidBody({
      type: 'dynamic',
      mass: 10,
      gravityScale: 1,
      linearDamping: 1,
      disabled: false,
      oneWay: false,
    });

    rigidBody.sleep();
    expect(rigidBody.sleeping).toEqual(true);
    expect(rigidBody.disabled).toEqual(false);

    rigidBody.wakeUp();
    expect(rigidBody.sleeping).toEqual(false);
    expect(rigidBody.disabled).toEqual(false);
  });

  it('Returns zero inverse mass for zero or negative mass', () => {
    const rigidBody = new RigidBody({
      type: 'dynamic',
      mass: 10,
      gravityScale: 1,
      linearDamping: 1,
      disabled: false,
      oneWay: false,
    });

    rigidBody.mass = 0;
    expect(rigidBody.inverseMass).toEqual(0);

    rigidBody.mass = -10;
    expect(rigidBody.inverseMass).toEqual(0);
  });
});
