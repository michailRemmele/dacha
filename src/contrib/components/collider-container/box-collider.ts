export class BoxCollider {
  sizeX: number;
  sizeY: number;
  centerX: number;
  centerY: number;

  constructor(config: Record<string, number>) {
    this.sizeX = config.sizeX;
    this.sizeY = config.sizeY;
    this.centerX = config.centerX;
    this.centerY = config.centerY;
  }
}
