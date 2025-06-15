import { Collider } from '../index';

describe('Contrib -> components -> Collider', () => {
  it('Returns correct values ', () => {
    const box = new Collider({
      type: 'box',
      sizeX: 10,
      sizeY: 20,
      centerX: 1,
      centerY: 2,
    }).clone();
    const circle = new Collider({
      type: 'circle',
      centerX: 1,
      centerY: 2,
      radius: 20,
    }).clone();

    expect(box.type).toEqual('box');
    expect(box.sizeX).toEqual(10);
    expect(box.sizeY).toEqual(20);
    expect(box.centerX).toEqual(1);
    expect(box.centerY).toEqual(2);

    expect(circle.type).toEqual('circle');
    expect(circle.radius).toEqual(20);
    expect(circle.centerX).toEqual(1);
    expect(circle.centerY).toEqual(2);
  });

  it('Correct updates values ', () => {
    const box = new Collider({
      type: 'box',
      sizeX: 10,
      sizeY: 20,
      centerX: 1,
      centerY: 2,
    }).clone();
    const circle = new Collider({
      type: 'circle',
      radius: 20,
      centerX: 1,
      centerY: 2,
    }).clone();

    box.sizeX = 20;
    box.sizeY = 40;
    box.centerX = 2;
    box.centerY = 4;

    circle.radius = 40;
    circle.centerX = 3;
    circle.centerY = 6;

    expect(box.sizeX).toEqual(20);
    expect(box.sizeY).toEqual(40);
    expect(box.centerX).toEqual(2);
    expect(box.centerY).toEqual(4);

    expect(circle.radius).toEqual(40);
    expect(circle.centerX).toEqual(3);
    expect(circle.centerY).toEqual(6);
  });

  it('Clones return deep copy of original component', () => {
    const originalBox = new Collider({
      type: 'box',
      sizeX: 10,
      sizeY: 20,
      centerX: 1,
      centerY: 2,
    });
    const cloneBox = originalBox.clone();

    expect(originalBox).not.toBe(cloneBox);

    const originalCircle = new Collider({
      type: 'circle',
      radius: 20,
      centerX: 1,
      centerY: 2,
    });
    const cloneCircle = originalCircle.clone();

    expect(originalCircle).not.toBe(cloneCircle);
  });
});
