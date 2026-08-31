import { Vector } from '../index';

describe('MathLib -> vector -> Vector', () => {
  describe('squaredMagnitude', () => {
    it('Returns squared vector length without normalizing', () => {
      const vector = new Vector(3, 4);

      expect(vector.squaredMagnitude).toBe(25);
      expect(vector.magnitude).toBe(5);
    });
  });
});
