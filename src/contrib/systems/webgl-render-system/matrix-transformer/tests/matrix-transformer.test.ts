import { MatrixTransformer, Matrix3x3 } from '../index';

describe('Contrib -> RenderSystem -> MatrixTransformer', () => {
  const matrixTransformer = new MatrixTransformer();

  it('Returns correct identity matrix', () => {
    expect(matrixTransformer.getIdentityMatrix()).toEqual([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ]);
  });

  it('Projects matrix correctly', () => {
    const testMatrix: Matrix3x3 = [
      10, 20, 30,
      40, 50, 60,
      70, 80, 90,
    ];

    matrixTransformer.project(testMatrix, 5, 10);

    expect(testMatrix).toEqual([
      4, -4, 30,
      16, -10, 60,
      28, -16, 90,
    ]);
  });

  it('Translates by x axis matrix correctly', () => {
    const testMatrix: Matrix3x3 = [
      1, 2, 3,
      4, 5, 6,
      7, 8, 9,
    ];

    matrixTransformer.translate(testMatrix, 2, 4);

    expect(testMatrix).toEqual([
      7, 14, 3,
      16, 29, 6,
      25, 44, 9,
    ]);
  });

  it('Flips by X axis matrix correctly', () => {
    const testMatrix: Matrix3x3 = [
      10, 20, 30,
      40, 50, 60,
      70, 80, 90,
    ];

    matrixTransformer.flipX(testMatrix);

    expect(testMatrix).toEqual([
      -10, 20, 30,
      -40, 50, 60,
      -70, 80, 90,
    ]);
  });

  it('Flips by Y axis matrix correctly', () => {
    const testMatrix: Matrix3x3 = [
      10, 20, 30,
      40, 50, 60,
      70, 80, 90,
    ];

    matrixTransformer.flipY(testMatrix);

    expect(testMatrix).toEqual([
      10, -20, 30,
      40, -50, 60,
      70, -80, 90,
    ]);
  });

  it('Scales matrix correctly', () => {
    const testMatrix: Matrix3x3 = [
      1, 2, 3,
      4, 5, 6,
      7, 8, 9,
    ];

    matrixTransformer.scale(testMatrix, 2, 4);

    expect(testMatrix).toEqual([
      2, 8, 3,
      8, 20, 6,
      14, 32, 9,
    ]);
  });

  it('Rotates matrix correctly', () => {
    const testMatrix: Matrix3x3 = [
      10, 20, 30,
      40, 50, 60,
      70, 80, 90,
    ];

    matrixTransformer.rotate(testMatrix, 90);

    expect(testMatrix[0]).toBeCloseTo(-20);
    expect(testMatrix[1]).toBeCloseTo(10);
    expect(testMatrix[2]).toBeCloseTo(30);
    expect(testMatrix[3]).toBeCloseTo(-50);
    expect(testMatrix[4]).toBeCloseTo(40);
    expect(testMatrix[5]).toBeCloseTo(60);
    expect(testMatrix[6]).toBeCloseTo(-80);
    expect(testMatrix[7]).toBeCloseTo(70);
    expect(testMatrix[8]).toBeCloseTo(90);
  });
});
