class RigidBody {
  constructor() {
    this._forceVectors = {};
  }

  set forceVectors(forceVectors) {
    this._forceVectors = forceVectors;
  }

  get forceVectors() {
    return this._forceVectors;
  }

  clone() {
    return new RigidBody();
  }
}

export default RigidBody;
