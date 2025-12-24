export interface Position {
  x: number;
  y: number;
}

export class Matrix {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
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

  identity(): Matrix {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.tx = 0;
    this.ty = 0;

    return this;
  }

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

  static multiply(res: Matrix, a: Matrix, b: Matrix): Matrix {
    res.a = a.a * b.a + a.c * b.b;
    res.b = a.b * b.a + a.d * b.b;
    res.c = a.a * b.c + a.c * b.d;
    res.d = a.b * b.c + a.d * b.d;
    res.tx = a.a * b.tx + a.c * b.ty + a.tx;
    res.ty = a.b * b.tx + a.d * b.ty + a.ty;

    return res;
  }

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

  apply(p: Position): Position {
    return {
      x: this.a * p.x + this.c * p.y + this.tx,
      y: this.b * p.x + this.d * p.y + this.ty,
    };
  }

  assign(
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number,
  ): Matrix;
  assign(m: Matrix): Matrix;
  assign(
    mOrA: Matrix | number,
    b?: number,
    c?: number,
    d?: number,
    tx?: number,
    ty?: number,
  ): Matrix {
    if (mOrA instanceof Matrix) {
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

  clone(): Matrix {
    return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
  }
}
