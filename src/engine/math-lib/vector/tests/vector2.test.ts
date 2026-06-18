import { Vector2 } from '../vector2';

describe('MathLib -> vector -> Vector2', () => {
  describe('squaredMagnitude', () => {
    it('Returns squared vector length without normalizing', () => {
      const vector = new Vector2(3, 4);

      expect(vector.squaredMagnitude).toBe(25);
      expect(vector.magnitude).toBe(5);
    });
  });
});
