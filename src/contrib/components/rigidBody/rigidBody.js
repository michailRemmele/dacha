import Component from 'engine/component/component';

class RigidBody extends Component {
  constructor(config) {
    super();

    this._forceVectors = {};
    this._mass = config.mass;
    this._useGravity = config.useGravity;
    this._isPermeable = config.isPermeable;
  }

  set forceVectors(forceVectors) {
    this._forceVectors = forceVectors;
  }

  get forceVectors() {
    return this._forceVectors;
  }

  set mass(mass) {
    this._mass = mass;
  }

  get mass() {
    return this._mass;
  }

  set useGravity(useGravity) {
    this._useGravity = useGravity;
  }

  get useGravity() {
    return this._useGravity;
  }

  set isPermeable(isPermeable) {
    this._isPermeable = isPermeable;
  }

  get isPermeable() {
    return this._isPermeable;
  }

  clone() {
    return new RigidBody({
      mass: this.mass,
      useGravity: this.useGravity,
      isPermeable: this.isPermeable,
    });
  }
}

export default RigidBody;
