/** @inline */
export interface Position {
  x: number;
  y: number;
}

/**
 * A 2D affine transformation matrix. {@link Transform} uses it for
 * `localMatrix` and `worldMatrix`.
 *
 * The matrix is:
 *
 * ```
 * | a  c  tx |
 * | b  d  ty |
 * | 0  0  1  |
 * ```
 *
 * The methods change the matrix in place and return it, so calls can be chained.
 *
 * @category Math
 */
export class Matrix {
  /** Scale and rotation, x axis. */
  a: number;
  /** Skew and rotation, x axis. */
  b: number;
  /** Skew and rotation, y axis. */
  c: number;
  /** Scale and rotation, y axis. */
  d: number;
  /** Translation on x. */
  tx: number;
  /** Translation on y. */
  ty: number;

  constructor(
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number,
  ) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
  }

  /** Resets the matrix to the identity matrix. */
  identity(): Matrix {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.tx = 0;
    this.ty = 0;

    return this;
  }

  /**
   * Multiplies this matrix by `m`: `this = this * m`. The result applies `m`
   * first, then this matrix.
   */
  multiply(m: Matrix): Matrix {
    const a = this.a * m.a + this.c * m.b;
    const b = this.b * m.a + this.d * m.b;
    const c = this.a * m.c + this.c * m.d;
    const d = this.b * m.c + this.d * m.d;
    const tx = this.a * m.tx + this.c * m.ty + this.tx;
    const ty = this.b * m.tx + this.d * m.ty + this.ty;

    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;

    return this;
  }

  /**
   * Multiplies `m` by this matrix: `this = m * this`. The result applies this
   * matrix first, then `m`.
   */
  multiplyRight(m: Matrix): Matrix {
    const a = m.a * this.a + m.c * this.b;
    const b = m.b * this.a + m.d * this.b;
    const c = m.a * this.c + m.c * this.d;
    const d = m.b * this.c + m.d * this.d;
    const tx = m.a * this.tx + m.c * this.ty + m.tx;
    const ty = m.b * this.tx + m.d * this.ty + m.ty;

    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;

    return this;
  }

  /** Writes `a * b` into `res` and returns `res`. */
  static multiply(res: Matrix, a: Matrix, b: Matrix): Matrix {
    res.a = a.a * b.a + a.c * b.b;
    res.b = a.b * b.a + a.d * b.b;
    res.c = a.a * b.c + a.c * b.d;
    res.d = a.b * b.c + a.d * b.d;
    res.tx = a.a * b.tx + a.c * b.ty + a.tx;
    res.ty = a.b * b.tx + a.d * b.ty + a.ty;

    return res;
  }

  /** Inverts the matrix. A matrix that cannot be inverted becomes the identity matrix. */
  invert(): Matrix {
    const det = this.a * this.d - this.b * this.c;

    if (!det) {
      return this.identity();
    }

    const inv = 1 / det;

    const a = this.d * inv;
    const b = -this.b * inv;
    const c = -this.c * inv;
    const d = this.a * inv;
    const tx = (this.c * this.ty - this.d * this.tx) * inv;
    const ty = (this.b * this.tx - this.a * this.ty) * inv;

    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;

    return this;
  }

  /** Transforms a point and returns the result as a new object. */
  apply(p: Position): Position {
    return {
      x: this.a * p.x + this.c * p.y + this.tx,
      y: this.b * p.x + this.d * p.y + this.ty,
    };
  }

  /** Sets all six values. */
  assign(
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number,
  ): Matrix;
  /** Copies the values of `m`. */
  assign(m: Matrix): Matrix;
  assign(
    mOrA: Matrix | number,
    b?: number,
    c?: number,
    d?: number,
    tx?: number,
    ty?: number,
  ): Matrix {
    if (typeof mOrA !== 'number') {
      this.a = mOrA.a;
      this.b = mOrA.b;
      this.c = mOrA.c;
      this.d = mOrA.d;
      this.tx = mOrA.tx;
      this.ty = mOrA.ty;
    } else {
      this.a = mOrA;
      this.b = b!;
      this.c = c!;
      this.d = d!;
      this.tx = tx!;
      this.ty = ty!;
    }

    return this;
  }

  /** Returns a new matrix with the same values. */
  clone(): Matrix {
    return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
  }
}
