class Observer {
  constructor(initalValue) {
    this._value = initalValue;
    this._subscribers = [];
  }

  next(value) {
    this._value = value;
    this._subscribers.forEach((callback) => callback(this._value));
  }

  subscribe(callback) {
    if (!(callback instanceof Function)) {
      throw new Error('Callback should be a function');
    }

    this._subscribers.push(callback);
  }

  unsubscribe(callback) {
    if (!(callback instanceof Function)) {
      throw new Error('Callback should be a function');
    }

    this._subscribers = this._subscribers.filter((subscription) => subscription !== callback);
  }
}

export default Observer;
