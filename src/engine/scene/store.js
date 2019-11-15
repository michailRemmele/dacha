class Store {
  constructor() {
    this._store = {};
  }

  set(name, value) {
    this._store[name] = value;
  }

  get(name) {
    return this._store[name];
  }

  has(name) {
    return !!this._store[name];
  }

  delete(name) {
    const isValueExisted = this.has(name);

    this._store[name] = undefined;

    return isValueExisted;
  }
}

export default Store;
