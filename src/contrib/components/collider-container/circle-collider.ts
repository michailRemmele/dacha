export class CircleCollider {
  radius: number;
  centerX: number;
  centerY: number;

  constructor(config: Record<string, number>) {
    this.radius = config.radius;
    this.centerX = config.centerX;
    this.centerY = config.centerY;
  }
}
