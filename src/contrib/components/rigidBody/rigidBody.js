class RigidBody {
  constructor(config) {
    this._speed = config.speed;
    this._forceVectors = {};
  }

  set speed(speed) {
    this._speed = speed;
  }

  get speed() {
    return this._speed;
  }

  set forceVectors(forceVectors) {
    this._forceVectors = forceVectors;
  }

  get forceVectors() {
    return this._forceVectors;
  }

  clone() {
    return new RigidBody({
      speed: this.speed,
    });
  }
}

export default RigidBody;
