import { ColliderContainer } from '../index';
import { BoxCollider } from '../box-collider';
import { CircleCollider } from '../circle-collider';

describe('Contrib -> components -> ColliderContainer', () => {
  it('Returns correct values ', () => {
    const boxColliderContainer = new ColliderContainer({
      type: 'boxCollider',
      collider: {
        sizeX: 10,
        sizeY: 20,
        centerX: 1,
        centerY: 2,
      },
    }).clone();
    const circleColliderContainer = new ColliderContainer({
      type: 'circleCollider',
      collider: {
        radius: 20,
        centerX: 1,
        centerY: 2,
      },
    }).clone();

    const boxCollider = boxColliderContainer.collider as BoxCollider;
    const circleCollider = circleColliderContainer.collider as CircleCollider;

    expect(boxColliderContainer.type).toEqual('boxCollider');
    expect(boxCollider.sizeX).toEqual(10);
    expect(boxCollider.sizeY).toEqual(20);
    expect(boxCollider.centerX).toEqual(1);
    expect(boxCollider.centerY).toEqual(2);

    expect(circleColliderContainer.type).toEqual('circleCollider');
    expect(circleCollider.radius).toEqual(20);
    expect(circleCollider.centerX).toEqual(1);
    expect(circleCollider.centerY).toEqual(2);
  });

  it('Correct updates values ', () => {
    const boxColliderContainer = new ColliderContainer({
      type: 'boxCollider',
      collider: {
        sizeX: 10,
        sizeY: 20,
        centerX: 1,
        centerY: 2,
      },
    }).clone();
    const circleColliderContainer = new ColliderContainer({
      type: 'circleCollider',
      collider: {
        radius: 20,
        centerX: 1,
        centerY: 2,
      },
    }).clone();

    const boxCollider = boxColliderContainer.collider as BoxCollider;
    const circleCollider = circleColliderContainer.collider as CircleCollider;

    boxCollider.sizeX = 20;
    boxCollider.sizeY = 40;
    boxCollider.centerX = 2;
    boxCollider.centerY = 4;

    circleCollider.radius = 40;
    circleCollider.centerX = 3;
    circleCollider.centerY = 6;

    expect(boxCollider.sizeX).toEqual(20);
    expect(boxCollider.sizeY).toEqual(40);
    expect(boxCollider.centerX).toEqual(2);
    expect(boxCollider.centerY).toEqual(4);

    expect(circleCollider.radius).toEqual(40);
    expect(circleCollider.centerX).toEqual(3);
    expect(circleCollider.centerY).toEqual(6);
  });

  it('Throws error if type of collider unexpected ', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const incorrectColliderContainer = new ColliderContainer({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: For test to throw error
        type: 'superCollider',
        collider: {
          centerX: 1,
          centerY: 2,
        },
      });
    }).toThrowError('Not found collider with same type: superCollider');
  });

  it('Clones return deep copy of original component', () => {
    const originalBoxColliderContainer = new ColliderContainer({
      type: 'boxCollider',
      collider: {
        sizeX: 10,
        sizeY: 20,
        centerX: 1,
        centerY: 2,
      },
    });
    const cloneBoxColliderContainer = originalBoxColliderContainer.clone();

    expect(originalBoxColliderContainer).not.toBe(cloneBoxColliderContainer);

    expect(originalBoxColliderContainer.collider).not.toBe(
      cloneBoxColliderContainer.collider,
    );

    const originalCircleColliderContainer = new ColliderContainer({
      type: 'circleCollider',
      collider: {
        radius: 20,
        centerX: 1,
        centerY: 2,
      },
    });
    const cloneCircleColliderContainer = originalCircleColliderContainer.clone();

    expect(originalCircleColliderContainer).not.toBe(cloneCircleColliderContainer);

    expect(originalCircleColliderContainer.collider).not.toBe(
      cloneCircleColliderContainer.collider,
    );
  });
});
