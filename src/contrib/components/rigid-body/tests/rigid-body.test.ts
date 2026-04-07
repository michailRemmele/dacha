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
    }).clone();

    expect(rigidBody.type).toEqual('dynamic');
    expect(rigidBody.mass).toEqual(10);
    expect(rigidBody.inverseMass).toEqual(0.1);
    expect(rigidBody.gravityScale).toEqual(1);
    expect(rigidBody.linearDamping).toEqual(1);
    expect(rigidBody.linearVelocity.equals(new Vector2(0, 0))).toEqual(true);
    expect(rigidBody.disabled).toEqual(false);
    expect(rigidBody.sleeping).toEqual(false);
  });

  it('Correct updates values ', () => {
    const rigidBody = new RigidBody({
      type: 'dynamic',
      mass: 10,
      gravityScale: 1,
      linearDamping: 1,
      disabled: false,
    }).clone();

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
    });

    rigidBody.sleep();
    expect(rigidBody.sleeping).toEqual(true);
    expect(rigidBody.disabled).toEqual(false);

    rigidBody.wakeUp();
    expect(rigidBody.sleeping).toEqual(false);
    expect(rigidBody.disabled).toEqual(false);
  });

  it('Clones return deep copy of original component', () => {
    const originalRigidBody = new RigidBody({
      type: 'dynamic',
      mass: 10,
      gravityScale: 1,
      linearDamping: 1,
      disabled: false,
    });
    const cloneRigidBody = originalRigidBody.clone();

    expect(originalRigidBody).not.toBe(cloneRigidBody);
  });

  it('Returns zero inverse mass for zero or negative mass', () => {
    const rigidBody = new RigidBody({
      type: 'dynamic',
      mass: 10,
      gravityScale: 1,
      linearDamping: 1,
      disabled: false,
    });

    rigidBody.mass = 0;
    expect(rigidBody.inverseMass).toEqual(0);

    rigidBody.mass = -10;
    expect(rigidBody.inverseMass).toEqual(0);
  });
});
