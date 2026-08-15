import { Vector2 } from '../../../../../../../engine/math-lib';
import type { BoxGeometry, Point } from '../../types';
import { BOX_CORNER_SIGNS } from './constants';

/**
 * Reusable temporary workspace for axis-aligned `BoxGeometry`.
 *
 * Some shape-cast substeps need a short-lived box-shaped target whose edges are
 * already known to be axis-aligned. This workspace updates one reusable
 * `BoxGeometry` object instead of routing those rectangles through the generic
 * convex hull path.
 *
 * The returned geometry is a mutable view into this workspace. Use it
 * immediately and do not store it across later `buildGeometry(...)` calls.
 */
export class AxisAlignedBoxWorkspace {
  private readonly points = Array.from(
    { length: BOX_CORNER_SIGNS.length },
    () => ({ x: 0, y: 0 }),
  );
  private readonly geometry: BoxGeometry = {
    center: { x: 0, y: 0 },
    points: this.points,
    edges: [
      {
        point1: this.points[0],
        point2: this.points[1],
        normal: new Vector2(-1, 0),
      },
      {
        point1: this.points[1],
        point2: this.points[2],
        normal: new Vector2(0, 1),
      },
      {
        point1: this.points[2],
        point2: this.points[3],
        normal: new Vector2(1, 0),
      },
      {
        point1: this.points[3],
        point2: this.points[0],
        normal: new Vector2(0, -1),
      },
    ],
  };

  /**
   * Updates the reusable box and returns it as `BoxGeometry`.
   *
   * `halfExtentsX` and `halfExtentsY` are applied around `center`. The edge
   * point references and normals are fixed at construction time; only point and
   * center coordinates change per call.
   */
  buildGeometry(
    center: Point,
    halfExtentsX: number,
    halfExtentsY: number,
  ): BoxGeometry {
    this.geometry.center.x = center.x;
    this.geometry.center.y = center.y;

    for (let index = 0; index < BOX_CORNER_SIGNS.length; index += 1) {
      const [signX, signY] = BOX_CORNER_SIGNS[index];
      const point = this.points[index];

      point.x = center.x + halfExtentsX * signX;
      point.y = center.y + halfExtentsY * signY;
    }

    return this.geometry;
  }
}
