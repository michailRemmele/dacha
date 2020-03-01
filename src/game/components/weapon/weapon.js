import Component from 'engine/component/component';

class Weapon extends Component {
  constructor(config) {
    super();

    this._bullet = config.bullet;
    this._damage = config.damage;
    this._fetterDuration = config.fetterDuration;
    this._speed = config.speed;
    this._range = config.range;
    this._cooldown = config.cooldown;
    this._cooldownRemaining = 0;
  }

  set bullet(bullet) {
    this._bullet = bullet;
  }

  get bullet() {
    return this._bullet;
  }

  set damage(damage) {
    this._damage = damage;
  }

  get damage() {
    return this._damage;
  }

  set fetterDuration(fetterDuration) {
    this._fetterDuration = fetterDuration;
  }

  get fetterDuration() {
    return this._fetterDuration;
  }

  set speed(speed) {
    this._speed = speed;
  }

  get speed() {
    return this._speed;
  }

  set range(range) {
    this._range = range;
  }

  get range() {
    return this._range;
  }

  set cooldown(cooldown) {
    this._cooldown = cooldown;
  }

  get cooldown() {
    return this._cooldown;
  }

  set cooldownRemaining(cooldownRemaining) {
    this._cooldownRemaining = cooldownRemaining;
  }

  get cooldownRemaining() {
    return this._cooldownRemaining;
  }

  clone() {
    return new Weapon({
      bullet: this.bullet,
      damage: this.damage,
      fetterDuration: this.fetterDuration,
      speed: this.speed,
      range: this.range,
      cooldown: this.cooldown,
    });
  }
}

export default Weapon;
