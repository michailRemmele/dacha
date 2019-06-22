import AABBBuilder from './aabbBuilder';
import AABB from './aabb';

class BoxAABBBuilder extends AABBBuilder {
  getAABB(collider, transform, coordinates) {
    const centerX = collider.centerX + transform.offsetX;
    const centerY = collider.centerY + transform.offsetY;

    const radii = coordinates.reduce((storage, coordinate) => {
      const absX = Math.abs(coordinate.x);
      const absY = Math.abs(coordinate.y);
      storage.x = absX > storage.x ? absX : storage.x;
      storage.y = absY > storage.y ? absY : storage.y;

      return storage;
    }, { x: 0, y: 0 });

    return new AABB({ x: centerX, y: centerY }, radii.x, radii.y);
  }
}

export default BoxAABBBuilder;
