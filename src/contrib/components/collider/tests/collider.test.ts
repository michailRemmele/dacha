import { Collider } from '../index';

describe('Contrib -> components -> Collider', () => {
  it('Returns correct values ', () => {
    const box = new Collider({
      type: 'box',
      sizeX: 10,
      sizeY: 20,
      offsetX: 1,
      offsetY: 2,
      layer: 'player',
      disabled: false,
    });
    const circle = new Collider({
      type: 'circle',
      offsetX: 1,
      offsetY: 2,
      radius: 20,
      layer: 'enemy',
      disabled: false,
    });
    const segment = new Collider({
      type: 'segment',
      offsetX: 0,
      offsetY: 0,
      point1X: -1,
      point1Y: 0,
      point2X: 1,
      point2Y: 0,
      layer: 'ground',
      disabled: false,
    });
    const capsule = new Collider({
      type: 'capsule',
      offsetX: 0,
      offsetY: 0,
      point1X: -2,
      point1Y: 0,
      point2X: 2,
      point2Y: 0,
      radius: 1,
      layer: 'body',
      disabled: false,
    });

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
      sizeX: 10,
      sizeY: 20,
      offsetX: 1,
      offsetY: 2,
      layer: 'default',
      disabled: false,
    });
    const circle = new Collider({
      type: 'circle',
      radius: 20,
      offsetX: 1,
      offsetY: 2,
      layer: 'default',
      disabled: false,
    });
    const segment = new Collider({
      type: 'segment',
      offsetX: 0,
      offsetY: 0,
      point1X: -1,
      point1Y: 0,
      point2X: 1,
      point2Y: 0,
      layer: 'default',
      disabled: false,
    });
    const capsule = new Collider({
      type: 'capsule',
      offsetX: 0,
      offsetY: 0,
      point1X: -2,
      point1Y: 0,
      point2X: 2,
      point2Y: 0,
      radius: 1,
      layer: 'default',
      disabled: false,
    });

    if (box.shape.type === 'box') {
      box.shape.size.x = 20;
      box.shape.size.y = 40;
    }
    box.offset = { x: 2, y: 4 };

    if (circle.shape.type === 'circle') {
      circle.shape.radius = 40;
    }
    circle.offset = { x: 3, y: 6 };
    circle.layer = 'trigger';
    if (segment.shape.type === 'segment') {
      segment.shape.point1.x = -2;
      segment.shape.point1.y = 0;
      segment.shape.point2.x = 1;
      segment.shape.point2.y = 3;
    }
    if (capsule.shape.type === 'capsule') {
      capsule.shape.radius = 2;
      capsule.shape.point1.x = -3;
      capsule.shape.point1.y = 0;
      capsule.shape.point2.x = 3;
      capsule.shape.point2.y = 0;
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
});
