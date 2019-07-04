import AABBBuilder from './aabbBuilder';
import AABB from './aabb';

class BoxAABBBuilder extends AABBBuilder {
  getAABB(collider, coordinates) {
    const minMax = coordinates.points.reduce((storage, coordinate) => {
      const minX = storage.min.x;
      const minY = storage.min.y;
      const maxX = storage.max.x;
      const maxY = storage.max.y;

      storage.min.x = minX === null || coordinate.x < minX ? coordinate.x : minX;
      storage.min.y = minY === null || coordinate.y < minY ? coordinate.y : minY;
      storage.max.x = maxX === null || coordinate.x > maxX ? coordinate.x : maxX;
      storage.max.y = maxY === null || coordinate.y > maxY ? coordinate.y : maxY;

      return storage;
    }, { min: { x: null, y: null }, max: { x: null, y: null }});

    return new AABB({ x: minMax.min.x, y: minMax.min.y }, { x: minMax.max.x, y: minMax.max.y });
  }
}

export default BoxAABBBuilder;
