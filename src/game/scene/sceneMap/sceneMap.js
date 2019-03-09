import SortedMap from 'core/sortedMap/sortedMap';

class SceneMap {
  constructor(sizeX, sizeY) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;

    this.map = new SortedMap();
    for (let i = 0; i < this.sizeY; i++) {
      this.map.set(i, new SortedMap());
    }
  }

  insertValue(x, y, value) {
    if (x >= this.sizeX || y >= this.sizeY) {
      throw new Error('Invalid coordinates');
    }

    const mapRow = this.map.get(y);
    const cell = mapRow.get(x) || [];
    cell.push(value);
    mapRow.set(x, cell);
  }

  getCell(x, y) {
    if (x >= this.sizeX || y >= this.sizeY) {
      throw new Error('Invalid coordinates');
    }

    return this.map.get(y).get(x);
  }

  removeValue(x, y, value) {
    if (x >= this.sizeX || y >= this.sizeY) {
      throw new Error('Invalid coordinates');
    }

    const mapRow = this.map.get(y);
    const cell = mapRow.get(x) || [];
    mapRow.set(x, cell.filter((cellValue) => cellValue !== value));
  }

  clearCell(x, y) {
    if (x >= this.sizeX || y >= this.sizeY) {
      throw new Error('Invalid coordinates');
    }

    this.map.get(y).remove(x);
  }

  forEachValue(callbackFn) {
    this.map.forEach((row, y) => {
      row.forEach((cell, x) => {
        cell.forEach((value) => {
          callbackFn(value, x, y);
        });
      });
    });
  }
}

export default SceneMap;
