export class Store {
  private _store: Record<string, unknown>;

  constructor() {
    this._store = {};
  }

  set(name: string, value: unknown) {
    this._store[name] = value;
  }

  get(name: string) {
    return this._store[name];
  }

  has(name: string) {
    return !!this._store[name];
  }

  delete(name: string) {
    const isValueExisted = this.has(name);

    this._store[name] = undefined;

    return isValueExisted;
  }
}
