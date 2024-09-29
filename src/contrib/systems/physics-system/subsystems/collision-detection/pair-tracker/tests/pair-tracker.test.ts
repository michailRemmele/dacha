import { PairTracker } from '../index';

describe('Contrib -> systems -> PhysicsSystem -> CollisionDetection -> PairTracker', () => {
  it('accumulate only potentially colliding pairs', () => {
    const pairTracker = new PairTracker<number>();

    pairTracker.add(1, 2);
    pairTracker.add(1, 3);
    pairTracker.add(2, 3);
    pairTracker.add(3, 4);

    pairTracker.swap();

    expect(pairTracker.canCollide(1)).toBe(true);
    expect(pairTracker.canCollide(2)).toBe(true);
    expect(pairTracker.canCollide(3)).toBe(true);
    expect(pairTracker.canCollide(4)).toBe(true);
    expect(pairTracker.canCollide(5)).toBe(false);

    pairTracker.add(1, 4);
    pairTracker.add(2, 4);
    pairTracker.add(2, 1);
    pairTracker.add(3, 2);

    expect(pairTracker.values()).toStrictEqual([[2, 1], [2, 3]]);
  });
});
