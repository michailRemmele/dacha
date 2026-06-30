import { Actor } from '../../../../../../engine/actor';
import { Collider } from '../../../../../components/collider';
import { Transform } from '../../../../../components/transform';
import { calculateInertia } from '../mass-properties';

const getTransform = (): Transform => {
  return new Actor({ id: 'actor', name: 'actor' }).getComponent(Transform);
};

describe('PhysicsSystem -> physics -> mass properties', () => {
  it('Calculates circle inertia', () => {
    const transform = getTransform();
    const collider = new Collider({
      type: 'circle',
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      layer: 'default',
      disabled: false,
    });

    expect(calculateInertia(3, collider, transform)).toBeCloseTo(6);
  });

  it('Calculates box inertia', () => {
    const transform = getTransform();
    const collider = new Collider({
      type: 'box',
      sizeX: 2,
      sizeY: 4,
      offsetX: 0,
      offsetY: 0,
      layer: 'default',
      disabled: false,
    });

    expect(calculateInertia(3, collider, transform)).toBeCloseTo(5);
  });

  it('Calculates approximate capsule inertia using full outer height', () => {
    const transform = getTransform();
    const collider = new Collider({
      type: 'capsule',
      radius: 1,
      height: 4,
      offsetX: 0,
      offsetY: 0,
      layer: 'default',
      disabled: false,
    });

    expect(calculateInertia(3, collider, transform)).toBeCloseTo(10);
  });

  it('Calculates segment inertia with unit thickness', () => {
    const transform = getTransform();
    const collider = new Collider({
      type: 'segment',
      point1X: -2,
      point1Y: 0,
      point2X: 2,
      point2Y: 0,
      offsetX: 0,
      offsetY: 0,
      layer: 'default',
      disabled: false,
    });

    expect(calculateInertia(3, collider, transform)).toBeCloseTo(4.25);
  });

  it('Adds collider offset inertia after transform scale', () => {
    const transform = getTransform();
    const collider = new Collider({
      type: 'circle',
      radius: 1,
      offsetX: 2,
      offsetY: 1,
      layer: 'default',
      disabled: false,
    });

    transform.world.scale.x = 2;
    transform.world.scale.y = 3;

    expect(calculateInertia(2, collider, transform)).toBeCloseTo(59);
  });

  it('Returns zero for invalid or unavailable geometry', () => {
    const transform = getTransform();
    const collider = new Collider({
      type: 'circle',
      radius: 0,
      offsetX: 0,
      offsetY: 0,
      layer: 'default',
      disabled: false,
    });

    expect(calculateInertia(2, collider, transform)).toBe(0);
    expect(calculateInertia(2, undefined, transform)).toBe(0);
    expect(calculateInertia(0, collider, transform)).toBe(0);
  });
});
