import SortedMap from './sortedMap';

class SceneMap {
  constructor(sizeX, sizeY, sortingLayers) {
    this._sizeX = sizeX;
    this._sizeY = sizeY;
    this._sortingLayers = sortingLayers;

    this._map = this._sortingLayers.map(() => {
      const sortedMap = new SortedMap();
      for (let i = 0; i < this._sizeY; i++) {
        sortedMap.set(i, new SortedMap());
      }

      return sortedMap;
    });
  }

  _getSortLayerOrder(sortingLayer) {
    return this._sortingLayers.indexOf(sortingLayer);
  }

  insertValue(x, y, sortingLayer, value) {
    if (x >= this._sizeX || y >= this._sizeY) {
      throw new Error('Invalid coordinates');
    }

    const sortingLayerOrder = this._getSortLayerOrder(sortingLayer);

    const mapRow = this._map[sortingLayerOrder].get(y);
    const cell = mapRow.get(x) || [];
    cell.push(value);
    mapRow.set(x, cell);
  }

  getCell(x, y, sortingLayer) {
    if (x >= this._sizeX || y >= this._sizeY) {
      throw new Error('Invalid coordinates');
    }

    const sortingLayerOrder = this._getSortLayerOrder(sortingLayer);

    return this._map[sortingLayerOrder].get(y).get(x);
  }

  removeValue(x, y, sortingLayer, value) {
    if (x >= this._sizeX || y >= this._sizeY) {
      throw new Error('Invalid coordinates');
    }

    const sortingLayerOrder = this._getSortLayerOrder(sortingLayer);

    const mapRow = this._map[sortingLayerOrder].get(y);
    const cell = mapRow.get(x) || [];
    mapRow.set(x, cell.filter((cellValue) => cellValue !== value));
  }

  clearCell(x, y) {
    if (x >= this._sizeX || y >= this._sizeY) {
      throw new Error('Invalid coordinates');
    }

    this._map.forEach((mapLayer) => {
      mapLayer.get(y).remove(x);
    });
  }

  forEachValue(callbackFn) {
    this._map.forEach((mapLayer) => {
      mapLayer.forEach((row, y) => {
        row.forEach((cell, x) => {
          cell.forEach((value) => {
            callbackFn(value, x, y);
          });
        });
      });
    });
  }
}

export default SceneMap;
