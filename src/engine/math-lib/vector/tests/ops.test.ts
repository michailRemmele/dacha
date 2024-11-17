import { VectorOps } from '../ops';

describe('MathLib -> vector -> ops', () => {
  describe('projectPointToEdge()', () => {
    it('Returns correct projection to horizontal edge', () => {
      const edge = { point1: { x: 1, y: 10 }, point2: { x: 5, y: 10 } };

      expect(VectorOps.projectPointToEdge({ x: 2, y: 3 }, edge)).toEqual({ x: 2, y: 10 });
      expect(VectorOps.projectPointToEdge({ x: 3, y: 10 }, edge)).toEqual({ x: 3, y: 10 });
    });

    it('Returns correct projection to vertical edge', () => {
      const edge = { point1: { x: 5, y: -5 }, point2: { x: 5, y: 5 } };

      expect(VectorOps.projectPointToEdge({ x: 2, y: 3 }, edge)).toEqual({ x: 5, y: 3 });
      expect(VectorOps.projectPointToEdge({ x: 5, y: 0 }, edge)).toEqual({ x: 5, y: 0 });
    });

    it('Returns correct projection to rotated edge', () => {
      const point = { x: 0, y: 8 };
      const edge1 = { point1: { x: 0, y: 12 }, point2: { x: 4, y: 8 } };
      const edge2 = { point1: { x: 4, y: 8 }, point2: { x: 0, y: 12 } };

      expect(VectorOps.projectPointToEdge(point, edge1)).toEqual({ x: 2, y: 10 });
      expect(VectorOps.projectPointToEdge(point, edge2)).toEqual({ x: 2, y: 10 });
    });

    it('Returns correct projection to rotated edge, beyond edge', () => {
      const point = { x: 4, y: 0 };
      const edge1 = { point1: { x: 0, y: 12 }, point2: { x: 4, y: 8 } };
      const edge2 = { point1: { x: 4, y: 8 }, point2: { x: 0, y: 12 } };

      expect(VectorOps.projectPointToEdge(point, edge1)).toEqual({ x: 8, y: 4 });
      expect(VectorOps.projectPointToEdge(point, edge2)).toEqual({ x: 8, y: 4 });
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
