class MapObserver {
  constructor() {
    this._values = {};
    this._subscribers = {};
  }

  next(value, id) {
    this._values[id] = value;

    if (!this._subscribers[id]) {
      return;
    }

    this._subscribers[id].forEach((callback) => callback(this._values[id]));
  }

  subscribe(callback, id) {
    if (!(callback instanceof Function)) {
      throw new Error('Callback should be a function');
    }

    this._subscribers[id] = this._subscribers[id] || [];
    this._subscribers[id].push(callback);
  }

  unsubscribe(callback, id) {
    if (!(callback instanceof Function)) {
      throw new Error('Callback should be a function');
    }

    if (!this._subscribers[id]) {
      return;
    }

    this._subscribers[id] = this._subscribers[id].filter(
      (subscription) => subscription !== callback,
    );
  }
}

export default MapObserver;
