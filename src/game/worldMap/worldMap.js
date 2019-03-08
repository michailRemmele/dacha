import SortedMap from 'core/sortedMap/sortedMap';

class WorldMap {
  constructor(sizeX, sizeY) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;

    this.map = new SortedMap();
    for (let i = 0; i < this.sizeY; i++) {
      this.map.set(i, new SortedMap());
    }
  }

  set(x, y, item) {
    if (x >= this.sizeX || y >= this.sizeY) {
      throw new Error('Invalid coordinates');
    }

    const mapRow = this.map.get(y);
    const items = mapRow.get(x) || [];
    items.push(item);
    mapRow.set(x, items);
  }

  get(x, y) {
    if (x >= this.sizeX || y >= this.sizeY) {
      throw new Error('Invalid coordinates');
    }

    return this.map.get(y).get(x);
  }

  clear(x, y) {
    if (x >= this.sizeX || y >= this.sizeY) {
      throw new Error('Invalid coordinates');
    }

    this.map.get(y).remove(x);
  }

  forEach(callbackFn) {
    this.map.forEach((mapRow) => {
      mapRow.forEach(callbackFn);
    });
  }
}

export default WorldMap;
