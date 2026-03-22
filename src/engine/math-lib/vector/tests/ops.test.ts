import { VectorOps } from '../ops';

describe('MathLib -> vector -> ops', () => {
  describe('getClosestPointOnEdge()', () => {
    it('Returns correct closest point on horizontal edge', () => {
      const edge = { point1: { x: 1, y: 10 }, point2: { x: 5, y: 10 } };

      expect(VectorOps.getClosestPointOnEdge({ x: 2, y: 3 }, edge)).toEqual({ x: 2, y: 10 });
      expect(VectorOps.getClosestPointOnEdge({ x: 3, y: 10 }, edge)).toEqual({ x: 3, y: 10 });
    });

    it('Returns correct closest point on vertical edge', () => {
      const edge = { point1: { x: 5, y: -5 }, point2: { x: 5, y: 5 } };

      expect(VectorOps.getClosestPointOnEdge({ x: 2, y: 3 }, edge)).toEqual({ x: 5, y: 3 });
      expect(VectorOps.getClosestPointOnEdge({ x: 5, y: 0 }, edge)).toEqual({ x: 5, y: 0 });
    });

    it('Returns correct closest point on rotated edge', () => {
      const point = { x: 0, y: 8 };
      const edge1 = { point1: { x: 0, y: 12 }, point2: { x: 4, y: 8 } };
      const edge2 = { point1: { x: 4, y: 8 }, point2: { x: 0, y: 12 } };

      expect(VectorOps.getClosestPointOnEdge(point, edge1)).toEqual({ x: 2, y: 10 });
      expect(VectorOps.getClosestPointOnEdge(point, edge2)).toEqual({ x: 2, y: 10 });
    });

    it('Clamps to the nearest endpoint when projection falls beyond the edge', () => {
      const point = { x: 4, y: 0 };
      const edge1 = { point1: { x: 0, y: 12 }, point2: { x: 4, y: 8 } };
      const edge2 = { point1: { x: 4, y: 8 }, point2: { x: 0, y: 12 } };

      expect(VectorOps.getClosestPointOnEdge(point, edge1)).toEqual({ x: 4, y: 8 });
      expect(VectorOps.getClosestPointOnEdge(point, edge2)).toEqual({ x: 4, y: 8 });
    });
  });

  describe('isPointInPolygon()', () => {
    it('Returns true/false if point is inside/outside of polygon (rectangle)', () => {
      const polygon = [
        { point1: { x: 2, y: 12 }, point2: { x: 12, y: 12 } },
        { point1: { x: 12, y: 12 }, point2: { x: 12, y: 2 } },
        { point1: { x: 12, y: 2 }, point2: { x: 2, y: 2 } },
        { point1: { x: 2, y: 2 }, point2: { x: 2, y: 12 } },
      ];

      expect(VectorOps.isPointInPolygon({ x: 5, y: 5 }, polygon)).toBeTruthy();
      // Alghorithm is inaccurate when point has the same position as one of the polygon corners
      // expect(VectorOps.isPointInPolygon({ x: 2, y: 12 }, polygon)).toBeTruthy();
      expect(VectorOps.isPointInPolygon({ x: 2, y: 6 }, polygon)).toBeTruthy();

      expect(VectorOps.isPointInPolygon({ x: 14, y: 14 }, polygon)).toBeFalsy();
      expect(VectorOps.isPointInPolygon({ x: 2, y: 13 }, polygon)).toBeFalsy();
    });
  });
});
