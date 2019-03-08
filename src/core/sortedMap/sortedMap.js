class SortedMap {
  constructor() {
    this.map = new Map();
  }

  set(key, value) {
    this.map.set(key, value);
  }

  get(key) {
    return this.map.get(key);
  }

  remove(key) {
    this.map.delete(key);
  }

  forEach(callbackFn) {
    const sortFn = (a, b) => {
      if (a[0] > b[0]) {
        return 1;
      }
      if (a[0] < b[0]) {
        return -1;
      }
      return 0;
    };

    this.map = new Map([ ...this.map ].sort(sortFn));
    this.map.forEach(callbackFn);
  }
}

export default SortedMap;
