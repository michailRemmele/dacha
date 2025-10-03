import { Actor } from '../../../../engine/actor';
import { Transform } from '../index';

describe('Contrib -> components -> Transform', () => {
  let transform1: Transform;
  let transform2: Transform;
  let transform3: Transform;

  beforeEach(() => {
    transform1 = new Transform({
      offsetX: 10,
      offsetY: 5,
      rotation: 90,
      scaleX: 3,
      scaleY: 4,
    }).clone();
    transform2 = new Transform({
      offsetX: 20,
      offsetY: 10,
      rotation: 180,
      scaleX: 6,
      scaleY: 8,
    }).clone();
    transform3 = new Transform({
      offsetX: 30,
      offsetY: 20,
      rotation: 270,
      scaleX: 9,
      scaleY: 12,
    }).clone();

    const actor1 = new Actor({ id: '1', name: 'mock-actor-1' });
    const actor2 = new Actor({ id: '2', name: 'mock-actor-2' });
    const actor3 = new Actor({ id: '3', name: 'mock-actor-3' });

    actor1.setComponent(transform1);
    actor2.setComponent(transform2);
    actor3.setComponent(transform3);

    actor3.appendChild(actor2);
    actor2.appendChild(actor1);
  });

  it('Returns correct absolute values ', () => {
    expect(transform1.offsetX).toEqual(60);
    expect(transform1.offsetY).toEqual(35);
    expect(transform1.rotation).toEqual(540);
    expect(transform1.scaleX).toEqual(162);
    expect(transform1.scaleY).toEqual(384);

    expect(transform2.offsetX).toEqual(50);
    expect(transform2.offsetY).toEqual(30);
    expect(transform2.rotation).toEqual(450);
    expect(transform2.scaleX).toEqual(54);
    expect(transform2.scaleY).toEqual(96);

    expect(transform3.offsetX).toEqual(30);
    expect(transform3.offsetY).toEqual(20);
    expect(transform3.rotation).toEqual(270);
    expect(transform3.scaleX).toEqual(9);
    expect(transform3.scaleY).toEqual(12);
  });

  it('Returns correct relative values ', () => {
    expect(transform1.relativeOffsetX).toEqual(10);
    expect(transform1.relativeOffsetY).toEqual(5);
    expect(transform1.relativeRotation).toEqual(90);
    expect(transform1.relativeScaleX).toEqual(3);
    expect(transform1.relativeScaleY).toEqual(4);

    expect(transform2.relativeOffsetX).toEqual(20);
    expect(transform2.relativeOffsetY).toEqual(10);
    expect(transform2.relativeRotation).toEqual(180);
    expect(transform2.relativeScaleX).toEqual(6);
    expect(transform2.relativeScaleY).toEqual(8);

    expect(transform3.relativeOffsetX).toEqual(30);
    expect(transform3.relativeOffsetY).toEqual(20);
    expect(transform3.relativeRotation).toEqual(270);
    expect(transform3.relativeScaleX).toEqual(9);
    expect(transform3.relativeScaleY).toEqual(12);
  });

  it('Correct updates absolute values ', () => {
    transform1.offsetX = 80;
    transform1.offsetY = 55;
    transform1.rotation = 780;
    transform1.scaleX = 81;
    transform1.scaleY = 192;

    transform2.offsetX = 25;
    transform2.offsetY = 15;
    transform2.rotation = 360;
    transform2.scaleX = 27;
    transform2.scaleY = 48;

    transform3.offsetX = 15;
    transform3.offsetY = 10;
    transform3.rotation = 180;
    transform3.scaleX = 3;
    transform3.scaleY = 6;

    expect(transform1.offsetX).toEqual(40);
    expect(transform1.offsetY).toEqual(30);
    expect(transform1.rotation).toEqual(600);
    expect(transform1.scaleX).toEqual(13.5);
    expect(transform1.scaleY).toEqual(48);

    expect(transform2.offsetX).toEqual(10);
    expect(transform2.offsetY).toEqual(5);
    expect(transform2.rotation).toEqual(270);
    expect(transform2.scaleX).toEqual(9);
    expect(transform2.scaleY).toEqual(24);

    expect(transform3.offsetX).toEqual(15);
    expect(transform3.offsetY).toEqual(10);
    expect(transform3.rotation).toEqual(180);
    expect(transform3.scaleX).toEqual(3);
    expect(transform3.scaleY).toEqual(6);
  });

  it('Correct updates relative values ', () => {
    transform1.offsetX = 80;
    transform1.offsetY = 55;
    transform1.rotation = 780;
    transform1.scaleX = 81;
    transform1.scaleY = 192;

    transform2.offsetX = 25;
    transform2.offsetY = 15;
    transform2.rotation = 360;
    transform2.scaleX = 27;
    transform2.scaleY = 48;

    transform3.offsetX = 15;
    transform3.offsetY = 10;
    transform3.rotation = 180;
    transform3.scaleX = 3;
    transform3.scaleY = 6;

    expect(transform1.relativeOffsetX).toEqual(30);
    expect(transform1.relativeOffsetY).toEqual(25);
    expect(transform1.relativeRotation).toEqual(330);
    expect(transform1.relativeScaleX).toEqual(1.5);
    expect(transform1.relativeScaleY).toEqual(2);

    expect(transform2.relativeOffsetX).toEqual(-5);
    expect(transform2.relativeOffsetY).toEqual(-5);
    expect(transform2.relativeRotation).toEqual(90);
    expect(transform2.relativeScaleX).toEqual(3);
    expect(transform2.relativeScaleY).toEqual(4);

    expect(transform3.relativeOffsetX).toEqual(15);
    expect(transform3.relativeOffsetY).toEqual(10);
    expect(transform3.relativeRotation).toEqual(180);
    expect(transform3.relativeScaleX).toEqual(3);
    expect(transform3.relativeScaleY).toEqual(6);
  });

  it('Clones return deep copy of original component', () => {
    const originalTransform = new Transform({
      offsetX: 10,
      offsetY: 5,
      rotation: 90,
      scaleX: 3,
      scaleY: 4,
    });
    const cloneTransform = originalTransform.clone();

    expect(originalTransform).not.toBe(cloneTransform);
  });
});
