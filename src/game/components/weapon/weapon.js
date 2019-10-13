import Component from 'engine/component/component';

class Weapon extends Component {
  constructor(config) {
    super();

    this._bullet = config.bullet;
    this._speed = config.speed;
  }

  set bullet(bullet) {
    this._bullet = bullet;
  }

  get bullet() {
    return this._bullet;
  }

  set speed(speed) {
    this._speed = speed;
  }

  get speed() {
    return this._speed;
  }

  clone() {
    return new Weapon({
      bullet: this.bullet,
      speed: this.speed,
    });
  }
}

export default Weapon;
