import Timeline from './timeline';

class Substate {
  constructor(config) {
    this._name = config.name;
    this._timeline = new Timeline(config.timeline);
    this._x = config.x;
    this._y = config.y;
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set timeline(timeline) {
    this._timeline = timeline;
  }

  get timeline() {
    return this._timeline;
  }

  set x(x) {
    this._x = x;
  }

  get x() {
    return this._x;
  }

  set y(y) {
    this._y = y;
  }

  get y() {
    return this._y;
  }
}

export default Substate;
