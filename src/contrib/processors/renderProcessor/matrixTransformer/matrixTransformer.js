class MatrixTransformer {
  getIdentityMatrix() {
    return [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ];
  }

  project(matrix, width, height) {
    const projectedWidth = 2 / width;
    const projectedHeight = 2 / height;

    matrix[0] = matrix[0] * projectedWidth;
    matrix[1] = -matrix[1] * projectedHeight;
    matrix[3] = matrix[3] * projectedWidth;
    matrix[4] = -matrix[4] * projectedHeight;
    matrix[6] = matrix[6] * projectedWidth;
    matrix[7] = -matrix[7] * projectedHeight;
  }

  translate(matrix, tx, ty) {
    matrix[0] = matrix[0] + (matrix[2] * tx);
    matrix[1] = matrix[1] + (matrix[2] * ty);
    matrix[3] = matrix[3] + (matrix[5] * tx);
    matrix[4] = matrix[4] + (matrix[5] * ty);
    matrix[6] = matrix[6] + (matrix[8] * tx);
    matrix[7] = matrix[7] + (matrix[8] * ty);
  }

  flipX(matrix) {
    this.scale(matrix, -1, 1);
  }

  flipY(matrix) {
    this.scale(matrix, 1, -1);
  }

  scale(matrix, scaleX, scaleY) {
    matrix[0] = matrix[0] * scaleX;
    matrix[1] = matrix[1] * scaleY;
    matrix[3] = matrix[3] * scaleX;
    matrix[4] = matrix[4] * scaleY;
    matrix[6] = matrix[6] * scaleX;
    matrix[7] = matrix[7] * scaleY;
  }

  rotate(matrix, angle) {
    angle = angle * Math.PI / 180;
    const cos = Math.cos(angle);
    const sin = -Math.sin(angle);

    const matrix0 = matrix[0];
    const matrix3 = matrix[3];
    const matrix6 = matrix[6];

    matrix[0] = (matrix0 * cos) + (matrix[1] * sin);
    matrix[1] = (matrix[1] * cos) - (matrix0 * sin);
    matrix[3] = (matrix3 * cos) + (matrix[4] * sin);
    matrix[4] = (matrix[4] * cos) - (matrix3 * sin);
    matrix[6] = (matrix6 * cos) + (matrix[7] * sin);
    matrix[7] = (matrix[7] * cos) - (matrix6 * sin);
  }
}

export default MatrixTransformer;
