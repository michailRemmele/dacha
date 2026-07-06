import { RigidBody } from '../index';
import { Vector2 } from '../../../../engine/math-lib';

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

  it('Clears forces and velocities when sleeping', () => {
    const rigidBody = new RigidBody({
      type: 'dynamic',
      mass: 1,
      disabled: false,
      oneWay: false,
    });

    rigidBody.linearVelocity = new Vector2(1, 2);
    rigidBody.angularVelocity = 3;
    rigidBody._biasLinearVelocity = new Vector2(4, 5);
    rigidBody._biasAngularVelocity = 6;

    rigidBody.sleep();

    expect(rigidBody.linearVelocity).toStrictEqual(new Vector2(0, 0));
    expect(rigidBody.angularVelocity).toBe(0);
    expect(rigidBody._biasLinearVelocity).toStrictEqual(new Vector2(0, 0));
    expect(rigidBody._biasAngularVelocity).toBe(0);
    expect(rigidBody._centralForce).toStrictEqual(new Vector2(0, 0));
    expect(rigidBody._centralImpulse).toStrictEqual(new Vector2(0, 0));
    expect(rigidBody._pointForces).toHaveLength(0);
    expect(rigidBody._pointImpulses).toHaveLength(0);
    expect(rigidBody._torque).toEqual(0);
    expect(rigidBody._angularImpulse).toEqual(0);
  });

  it('Sleeps only active dynamic bodies', () => {
    const staticBody = new RigidBody({
      type: 'static',
      disabled: false,
      oneWay: false,
    });
    const kinematicBody = new RigidBody({
      type: 'kinematic',
      disabled: false,
      oneWay: false,
    });
    const disabledBody = new RigidBody({
      type: 'dynamic',
      disabled: true,
      oneWay: false,
    });

    staticBody.sleep();
    kinematicBody.sleep();
    disabledBody.sleep();

    expect(staticBody.sleeping).toBe(false);
    expect(kinematicBody.sleeping).toBe(false);
    expect(disabledBody.sleeping).toBe(false);
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

  it('Applies torque and angular impulses only to active unlocked dynamic bodies', () => {
    const dynamicBody = new RigidBody({
      type: 'dynamic',
      disabled: false,
      oneWay: false,
    });
    const staticBody = new RigidBody({
      type: 'static',
      disabled: false,
      oneWay: false,
    });
    const lockedBody = new RigidBody({
      type: 'dynamic',
      disabled: false,
      oneWay: false,
      lockRotation: true,
    });

    dynamicBody.sleep();
    dynamicBody.applyTorque(4);
    dynamicBody.applyAngularImpulse(2);
    staticBody.applyTorque(4);
    lockedBody.applyAngularImpulse(2);

    expect(dynamicBody.sleeping).toEqual(false);
    expect(dynamicBody._torque).toEqual(4);
    expect(dynamicBody._angularImpulse).toEqual(2);
    expect(staticBody._torque).toEqual(0);
    expect(lockedBody._angularImpulse).toEqual(0);
  });

  it('Clears force accumulators', () => {
    const rigidBody = new RigidBody({
      type: 'dynamic',
      disabled: false,
      oneWay: false,
    });

    rigidBody.applyForce(new Vector2(1, 2));
    rigidBody.applyForce(new Vector2(1, 2), { x: 3, y: 4 });
    rigidBody.applyImpulse(new Vector2(3, 4));
    rigidBody.applyImpulse(new Vector2(3, 4), { x: 5, y: 6 });
    rigidBody.applyTorque(5);
    rigidBody.applyAngularImpulse(6);
    rigidBody.clearForces();

    expect(rigidBody._centralForce).toStrictEqual(new Vector2(0, 0));
    expect(rigidBody._centralImpulse).toStrictEqual(new Vector2(0, 0));
    expect(rigidBody._pointForces).toHaveLength(0);
    expect(rigidBody._pointImpulses).toHaveLength(0);
    expect(rigidBody._torque).toEqual(0);
    expect(rigidBody._angularImpulse).toEqual(0);
  });
});
