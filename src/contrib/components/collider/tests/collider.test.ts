import { Collider } from '../index';

describe('Contrib -> components -> Collider', () => {
  it('Returns correct values ', () => {
    const box = new Collider({
      type: 'box',
      sizeX: 10,
      sizeY: 20,
      centerX: 1,
      centerY: 2,
      layer: 'player',
    }).clone();
    const circle = new Collider({
      type: 'circle',
      centerX: 1,
      centerY: 2,
      radius: 20,
      layer: 'enemy',
    }).clone();
    const segment = new Collider({
      type: 'segment',
      centerX: 0,
      centerY: 0,
      point1X: -1,
      point1Y: 0,
      point2X: 1,
      point2Y: 0,
      layer: 'ground',
    }).clone();

    expect(box.type).toEqual('box');
    expect(box.sizeX).toEqual(10);
    expect(box.sizeY).toEqual(20);
    expect(box.centerX).toEqual(1);
    expect(box.centerY).toEqual(2);
    expect(box.layer).toEqual('player');

    expect(circle.type).toEqual('circle');
    expect(circle.radius).toEqual(20);
    expect(circle.centerX).toEqual(1);
    expect(circle.centerY).toEqual(2);
    expect(circle.layer).toEqual('enemy');

    expect(segment.type).toEqual('segment');
    expect(segment.point1).toStrictEqual({ x: -1, y: 0 });
    expect(segment.point2).toStrictEqual({ x: 1, y: 0 });
    expect(segment.layer).toEqual('ground');
  });

  it('Correct updates values ', () => {
    const box = new Collider({
      type: 'box',
      sizeX: 10,
      sizeY: 20,
      centerX: 1,
      centerY: 2,
      layer: 'default',
    }).clone();
    const circle = new Collider({
      type: 'circle',
      radius: 20,
      centerX: 1,
      centerY: 2,
      layer: 'default',
    }).clone();
    const segment = new Collider({
      type: 'segment',
      centerX: 0,
      centerY: 0,
      point1X: -1,
      point1Y: 0,
      point2X: 1,
      point2Y: 0,
      layer: 'default',
    }).clone();

    box.sizeX = 20;
    box.sizeY = 40;
    box.centerX = 2;
    box.centerY = 4;

    circle.radius = 40;
    circle.centerX = 3;
    circle.centerY = 6;
    circle.layer = 'trigger';
    segment.point1 = { x: -2, y: 0 };
    segment.point2 = { x: 1, y: 3 };

    expect(box.sizeX).toEqual(20);
    expect(box.sizeY).toEqual(40);
    expect(box.centerX).toEqual(2);
    expect(box.centerY).toEqual(4);

    expect(circle.radius).toEqual(40);
    expect(circle.centerX).toEqual(3);
    expect(circle.centerY).toEqual(6);
    expect(circle.layer).toEqual('trigger');

    expect(segment.point1).toStrictEqual({ x: -2, y: 0 });
    expect(segment.point2).toStrictEqual({ x: 1, y: 3 });
  });

  it('Clones return deep copy of original component', () => {
    const originalBox = new Collider({
      type: 'box',
      sizeX: 10,
      sizeY: 20,
      centerX: 1,
      centerY: 2,
      layer: 'default',
    });
    const cloneBox = originalBox.clone();

    expect(originalBox).not.toBe(cloneBox);

    const originalCircle = new Collider({
      type: 'circle',
      radius: 20,
      centerX: 1,
      centerY: 2,
      layer: 'default',
    });
    const cloneCircle = originalCircle.clone();

    expect(originalCircle).not.toBe(cloneCircle);

    const originalSegment = new Collider({
      type: 'segment',
      centerX: 0,
      centerY: 0,
      point1X: -1,
      point1Y: 0,
      point2X: 1,
      point2Y: 0,
      layer: 'default',
    });
    const cloneSegment = originalSegment.clone();

    expect(originalSegment).not.toBe(cloneSegment);
  });
});
