import Component from 'engine/component/component';
import { Vector2 } from 'engine/mathLib';

class Movement extends Component {
  constructor(config) {
    super();

    this._speed = config.speed;
    this._vector = new Vector2(0, 0);
    this._penalty = 0;
  }

  set speed(speed) {
    this._speed = speed;
  }

  get speed() {
    return this._speed;
  }

  set vector(vector) {
    this._vector = vector;
  }

  get vector() {
    return this._vector;
  }

  set penalty(penalty) {
    this._penalty = penalty;
  }

  get penalty() {
    return this._penalty;
  }

  clone() {
    return new Movement({
      speed: this.speed,
    });
  }
}

export default Movement;
