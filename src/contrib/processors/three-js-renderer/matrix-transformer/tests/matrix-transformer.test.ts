import { MatrixTransformer, Matrix4x4 } from '../index';

describe('Contrib -> ThreeJSRenderer -> MatrixTransformer', () => {
  const matrixTransformer = new MatrixTransformer();

  it('Returns correct indentity matrix', () => {
    expect(matrixTransformer.getIdentityMatrix()).toEqual([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
  });

  it('Projects matrix correctly', () => {
    const testMatrix: Matrix4x4 = [
      10, 20, 30, 40,
      50, 60, 70, 80,
      90, 100, 110, 120,
      130, 140, 150, 160,
    ];

    matrixTransformer.project(testMatrix, 5, 10, 2);

    expect(testMatrix).toEqual([
      4, -4, 30, 40,
      20, -12, 70, 80,
      36, -20, 110, 120,
      52, -28, 150, 160,
    ]);
  });

  it('Translates by x axis matrix correctly', () => {
    const testMatrix: Matrix4x4 = [
      1, 2, 3, 4,
      5, 6, 7, 8,
      9, 10, 11, 12,
      13, 14, 15, 16,
    ];

    matrixTransformer.translate(testMatrix, 2, 4, 3);

    expect(testMatrix).toEqual([
      9, 18, 15, 4,
      21, 38, 31, 8,
      33, 58, 47, 12,
      45, 78, 63, 16,
    ]);
  });

  it('Scales matrix correctly', () => {
    const testMatrix: Matrix4x4 = [
      1, 2, 3, 4,
      5, 6, 7, 8,
      9, 10, 11, 12,
      13, 14, 15, 16,
    ];

    matrixTransformer.scale(testMatrix, 2, 4, 3);

    expect(testMatrix).toEqual([
      2, 8, 9, 4,
      10, 24, 21, 8,
      18, 40, 33, 12,
      26, 56, 45, 16,
    ]);
  });
});
