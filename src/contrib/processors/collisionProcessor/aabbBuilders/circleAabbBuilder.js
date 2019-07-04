import AABBBuilder from './aabbBuilder';
import AABB from './aabb';

class CircleAabbBuilder extends AABBBuilder {
  getAABB(collider, coordinates) {
    const { radius } = collider;
    const { x: centerX, y: centerY } = coordinates.center;

    const minX = centerX - radius;
    const maxX = centerX + radius;
    const minY = centerY - radius;
    const maxY = centerY + radius;

    return new AABB({ x: minX, y: minY }, { x: maxX, y: maxY });
  }
}

export default CircleAabbBuilder;
