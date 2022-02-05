export type Matrix4x4 = [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
];

export class MatrixTransformer {
  getIdentityMatrix(): Matrix4x4 {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ];
  }

  project(matrix: Matrix4x4, width: number, height: number, depth: number) {
    const projectedWidth = 2 / width;
    const projectedHeight = 2 / height;
    const projectedDepth = 2 / depth;

    matrix[0] *= projectedWidth;
    matrix[1] = -matrix[1] * projectedHeight;
    matrix[2] *= projectedDepth;

    matrix[4] *= projectedWidth;
    matrix[5] = -matrix[5] * projectedHeight;
    matrix[6] *= projectedDepth;

    matrix[8] *= projectedWidth;
    matrix[9] = -matrix[9] * projectedHeight;
    matrix[10] *= projectedDepth;

    matrix[12] *= projectedWidth;
    matrix[13] = -matrix[13] * projectedHeight;
    matrix[14] *= projectedDepth;
  }

  translate(matrix: Matrix4x4, tx: number, ty: number, tz: number) {
    matrix[0] += matrix[3] * tx;
    matrix[1] += matrix[3] * ty;
    matrix[2] += matrix[3] * tz;

    matrix[4] += matrix[7] * tx;
    matrix[5] += matrix[7] * ty;
    matrix[6] += matrix[7] * tz;

    matrix[8] += matrix[11] * tx;
    matrix[9] += matrix[11] * ty;
    matrix[10] += matrix[11] * tz;

    matrix[12] += matrix[15] * tx;
    matrix[13] += matrix[15] * ty;
    matrix[14] += matrix[15] * tz;
  }

  scale(matrix: Matrix4x4, scaleX: number, scaleY: number, scaleZ: number) {
    matrix[0] *= scaleX;
    matrix[1] *= scaleY;
    matrix[2] *= scaleZ;

    matrix[4] *= scaleX;
    matrix[5] *= scaleY;
    matrix[6] *= scaleZ;

    matrix[8] *= scaleX;
    matrix[9] *= scaleY;
    matrix[10] *= scaleZ;

    matrix[12] *= scaleX;
    matrix[13] *= scaleY;
    matrix[14] *= scaleZ;
  }
}
