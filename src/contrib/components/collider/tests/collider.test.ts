import { Collider } from '../index';

describe('Contrib -> components -> Collider', () => {
  it('Returns correct values ', () => {
    const box = new Collider({
      type: 'box',
      size: { x: 10, y: 20 },
      offset: { x: 1, y: 2 },
      layer: 'player',
    }).clone();
    const circle = new Collider({
      type: 'circle',
      offset: { x: 1, y: 2 },
      radius: 20,
      layer: 'enemy',
    }).clone();
    const segment = new Collider({
      type: 'segment',
      offset: { x: 0, y: 0 },
      point1: { x: -1, y: 0 },
      point2: { x: 1, y: 0 },
      layer: 'ground',
    }).clone();
    const capsule = new Collider({
      type: 'capsule',
      offset: { x: 0, y: 0 },
      point1: { x: -2, y: 0 },
      point2: { x: 2, y: 0 },
      radius: 1,
      layer: 'body',
    }).clone();

    expect(box.shape.type).toEqual('box');
    expect(box.shape).toStrictEqual({
      type: 'box',
      size: { x: 10, y: 20 },
    });
    expect(box.offset).toStrictEqual({ x: 1, y: 2 });
    expect(box.layer).toEqual('player');

    expect(circle.shape.type).toEqual('circle');
    expect(circle.shape).toStrictEqual({ type: 'circle', radius: 20 });
    expect(circle.offset).toStrictEqual({ x: 1, y: 2 });
    expect(circle.layer).toEqual('enemy');

    expect(segment.shape.type).toEqual('segment');
    expect(segment.shape).toStrictEqual({
      type: 'segment',
      point1: { x: -1, y: 0 },
      point2: { x: 1, y: 0 },
    });
    expect(segment.layer).toEqual('ground');

    expect(capsule.shape.type).toEqual('capsule');
    expect(capsule.shape).toStrictEqual({
      type: 'capsule',
      point1: { x: -2, y: 0 },
      point2: { x: 2, y: 0 },
      radius: 1,
    });
    expect(capsule.layer).toEqual('body');
  });

  it('Correct updates values ', () => {
    const box = new Collider({
      type: 'box',
      size: { x: 10, y: 20 },
      offset: { x: 1, y: 2 },
      layer: 'default',
    }).clone();
    const circle = new Collider({
      type: 'circle',
      radius: 20,
      offset: { x: 1, y: 2 },
      layer: 'default',
    }).clone();
    const segment = new Collider({
      type: 'segment',
      offset: { x: 0, y: 0 },
      point1: { x: -1, y: 0 },
      point2: { x: 1, y: 0 },
      layer: 'default',
    }).clone();
    const capsule = new Collider({
      type: 'capsule',
      offset: { x: 0, y: 0 },
      point1: { x: -1, y: 0 },
      point2: { x: 1, y: 0 },
      radius: 1,
      layer: 'default',
    }).clone();

    if (box.shape.type === 'box') {
      box.shape.size = { x: 20, y: 40 };
    }
    box.offset = { x: 2, y: 4 };

    if (circle.shape.type === 'circle') {
      circle.shape.radius = 40;
    }
    circle.offset = { x: 3, y: 6 };
    circle.layer = 'trigger';
    if (segment.shape.type === 'segment') {
      segment.shape.point1 = { x: -2, y: 0 };
      segment.shape.point2 = { x: 1, y: 3 };
    }
    if (capsule.shape.type === 'capsule') {
      capsule.shape.radius = 2;
      capsule.shape.point1 = { x: -3, y: 0 };
      capsule.shape.point2 = { x: 3, y: 0 };
    }

    expect(box.shape).toStrictEqual({
      type: 'box',
      size: { x: 20, y: 40 },
    });
    expect(box.offset).toStrictEqual({ x: 2, y: 4 });

    expect(circle.shape).toStrictEqual({ type: 'circle', radius: 40 });
    expect(circle.offset).toStrictEqual({ x: 3, y: 6 });
    expect(circle.layer).toEqual('trigger');

    expect(segment.shape).toStrictEqual({
      type: 'segment',
      point1: { x: -2, y: 0 },
      point2: { x: 1, y: 3 },
    });

    expect(capsule.shape).toStrictEqual({
      type: 'capsule',
      point1: { x: -3, y: 0 },
      point2: { x: 3, y: 0 },
      radius: 2,
    });
  });

  it('Clones return deep copy of original component', () => {
    const originalBox = new Collider({
      type: 'box',
      size: { x: 10, y: 20 },
      offset: { x: 1, y: 2 },
      layer: 'default',
    });
    const cloneBox = originalBox.clone();

    expect(originalBox).not.toBe(cloneBox);

    const originalCircle = new Collider({
      type: 'circle',
      radius: 20,
      offset: { x: 1, y: 2 },
      layer: 'default',
    });
    const cloneCircle = originalCircle.clone();

    expect(originalCircle).not.toBe(cloneCircle);

    const originalSegment = new Collider({
      type: 'segment',
      offset: { x: 0, y: 0 },
      point1: { x: -1, y: 0 },
      point2: { x: 1, y: 0 },
      layer: 'default',
    });
    const cloneSegment = originalSegment.clone();

    expect(originalSegment).not.toBe(cloneSegment);

    const originalCapsule = new Collider({
      type: 'capsule',
      offset: { x: 0, y: 0 },
      point1: { x: -1, y: 0 },
      point2: { x: 1, y: 0 },
      radius: 1,
      layer: 'default',
    });
    const cloneCapsule = originalCapsule.clone();

    expect(originalCapsule).not.toBe(cloneCapsule);
  });
});
