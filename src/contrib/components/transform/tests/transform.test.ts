import { GameObject } from '../../../../engine/gameObject';
import { Transform } from '../index';

describe('Contrib -> components -> Transform', () => {
  let transform1: Transform;
  let transform2: Transform;
  let transform3: Transform;

  beforeEach(() => {
    transform1 = new Transform('transform', {
      offsetX: 10,
      offsetY: 5,
      offsetZ: 1,
      rotation: 90,
      scaleX: 3,
      scaleY: 4,
    });
    transform2 = new Transform('transform', {
      offsetX: 20,
      offsetY: 10,
      offsetZ: 2,
      rotation: 180,
      scaleX: 6,
      scaleY: 8,
    });
    transform3 = new Transform('transform', {
      offsetX: 30,
      offsetY: 20,
      offsetZ: 3,
      rotation: 270,
      scaleX: 9,
      scaleY: 12,
    });

    const gameObject1 = new GameObject('mock-game-object-1');
    const gameObject2 = new GameObject('mock-game-object-2');
    const gameObject3 = new GameObject('mock-game-object-3');

    gameObject1.setComponent('transform', transform1);
    gameObject2.setComponent('transform', transform2);
    gameObject3.setComponent('transform', transform3);

    gameObject3.appendChild(gameObject2);
    gameObject2.appendChild(gameObject1);
  });

  it('Returns correct absolute values ', () => {
    expect(transform1.offsetX).toEqual(60);
    expect(transform1.offsetY).toEqual(35);
    expect(transform1.offsetZ).toEqual(6);
    expect(transform1.rotation).toEqual(540);
    expect(transform1.scaleX).toEqual(162);
    expect(transform1.scaleY).toEqual(384);

    expect(transform2.offsetX).toEqual(50);
    expect(transform2.offsetY).toEqual(30);
    expect(transform2.offsetZ).toEqual(5);
    expect(transform2.rotation).toEqual(450);
    expect(transform2.scaleX).toEqual(54);
    expect(transform2.scaleY).toEqual(96);

    expect(transform3.offsetX).toEqual(30);
    expect(transform3.offsetY).toEqual(20);
    expect(transform3.offsetZ).toEqual(3);
    expect(transform3.rotation).toEqual(270);
    expect(transform3.scaleX).toEqual(9);
    expect(transform3.scaleY).toEqual(12);
  });

  it('Returns correct relative values ', () => {
    expect(transform1.relativeOffsetX).toEqual(10);
    expect(transform1.relativeOffsetY).toEqual(5);
    expect(transform1.relativeOffsetZ).toEqual(1);
    expect(transform1.relativeRotation).toEqual(90);
    expect(transform1.relativeScaleX).toEqual(3);
    expect(transform1.relativeScaleY).toEqual(4);

    expect(transform2.relativeOffsetX).toEqual(20);
    expect(transform2.relativeOffsetY).toEqual(10);
    expect(transform2.relativeOffsetZ).toEqual(2);
    expect(transform2.relativeRotation).toEqual(180);
    expect(transform2.relativeScaleX).toEqual(6);
    expect(transform2.relativeScaleY).toEqual(8);

    expect(transform3.relativeOffsetX).toEqual(30);
    expect(transform3.relativeOffsetY).toEqual(20);
    expect(transform3.relativeOffsetZ).toEqual(3);
    expect(transform3.relativeRotation).toEqual(270);
    expect(transform3.relativeScaleX).toEqual(9);
    expect(transform3.relativeScaleY).toEqual(12);
  });

  it('Correct updates absolute values ', () => {
    transform1.offsetX = 80;
    transform1.offsetY = 55;
    transform1.offsetZ = 12;
    transform1.rotation = 780;
    transform1.scaleX = 81;
    transform1.scaleY = 192;

    transform2.offsetX = 25;
    transform2.offsetY = 15;
    transform2.offsetZ = 3;
    transform2.rotation = 360;
    transform2.scaleX = 27;
    transform2.scaleY = 48;

    transform3.offsetX = 15;
    transform3.offsetY = 10;
    transform3.offsetZ = 2;
    transform3.rotation = 180;
    transform3.scaleX = 3;
    transform3.scaleY = 6;

    expect(transform1.offsetX).toEqual(40);
    expect(transform1.offsetY).toEqual(30);
    expect(transform1.offsetZ).toEqual(9);
    expect(transform1.rotation).toEqual(600);
    expect(transform1.scaleX).toEqual(13.5);
    expect(transform1.scaleY).toEqual(48);

    expect(transform2.offsetX).toEqual(10);
    expect(transform2.offsetY).toEqual(5);
    expect(transform2.offsetZ).toEqual(2);
    expect(transform2.rotation).toEqual(270);
    expect(transform2.scaleX).toEqual(9);
    expect(transform2.scaleY).toEqual(24);

    expect(transform3.offsetX).toEqual(15);
    expect(transform3.offsetY).toEqual(10);
    expect(transform3.offsetZ).toEqual(2);
    expect(transform3.rotation).toEqual(180);
    expect(transform3.scaleX).toEqual(3);
    expect(transform3.scaleY).toEqual(6);
  });

  it('Correct updates relative values ', () => {
    transform1.offsetX = 80;
    transform1.offsetY = 55;
    transform1.offsetZ = 12;
    transform1.rotation = 780;
    transform1.scaleX = 81;
    transform1.scaleY = 192;

    transform2.offsetX = 25;
    transform2.offsetY = 15;
    transform2.offsetZ = 3;
    transform2.rotation = 360;
    transform2.scaleX = 27;
    transform2.scaleY = 48;

    transform3.offsetX = 15;
    transform3.offsetY = 10;
    transform3.offsetZ = 2;
    transform3.rotation = 180;
    transform3.scaleX = 3;
    transform3.scaleY = 6;

    expect(transform1.relativeOffsetX).toEqual(30);
    expect(transform1.relativeOffsetY).toEqual(25);
    expect(transform1.relativeOffsetZ).toEqual(7);
    expect(transform1.relativeRotation).toEqual(330);
    expect(transform1.relativeScaleX).toEqual(1.5);
    expect(transform1.relativeScaleY).toEqual(2);

    expect(transform2.relativeOffsetX).toEqual(-5);
    expect(transform2.relativeOffsetY).toEqual(-5);
    expect(transform2.relativeOffsetZ).toEqual(0);
    expect(transform2.relativeRotation).toEqual(90);
    expect(transform2.relativeScaleX).toEqual(3);
    expect(transform2.relativeScaleY).toEqual(4);

    expect(transform3.relativeOffsetX).toEqual(15);
    expect(transform3.relativeOffsetY).toEqual(10);
    expect(transform3.relativeOffsetZ).toEqual(2);
    expect(transform3.relativeRotation).toEqual(180);
    expect(transform3.relativeScaleX).toEqual(3);
    expect(transform3.relativeScaleY).toEqual(6);
  });
});
