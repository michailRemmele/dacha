export class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get magnitude(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  add(vector: Vector2): void {
    this.x += vector.x;
    this.y += vector.y;
  }

  multiplyNumber(number: number): void {
    this.x *= number;
    this.y *= number;
  }

  equals(vector: Vector2): boolean {
    return this.x === vector.x && this.y === vector.y;
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }
}
