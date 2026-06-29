import { RigidBody } from '../index';

describe('Contrib -> components -> RigidBody', () => {
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

  it('Clamps restitution between zero and one', () => {
    const rigidBody = new RigidBody({
      type: 'dynamic',
      disabled: false,
      oneWay: false,
    });

    rigidBody.restitution = 2;
    expect(rigidBody.restitution).toEqual(1);

    rigidBody.restitution = -1;
    expect(rigidBody.restitution).toEqual(0);
  });

  it('Clamps friction to non-negative values', () => {
    const rigidBody = new RigidBody({
      type: 'dynamic',
      disabled: false,
      oneWay: false,
    });

    rigidBody.friction = -1;
    expect(rigidBody.friction).toEqual(0);
  });
});
