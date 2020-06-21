import Component from 'engine/component/component';

class RigidBody extends Component {
  constructor(config) {
    super();

    this._mass = config.mass;
    this._useGravity = config.useGravity;
    this._isPermeable = config.isPermeable;
    this._ghost = config.ghost;
    this._isStatic = config.isStatic;
    this._drag = config.drag;
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

  set ghost(ghost) {
    this._ghost = ghost;
  }

  get ghost() {
    return this._ghost;
  }

  set isStatic(isStatic) {
    this._isStatic = isStatic;
  }

  get isStatic() {
    return this._isStatic;
  }

  set drag(drag) {
    this._drag = drag;
  }

  get drag() {
    return this._drag;
  }

  clone() {
    return new RigidBody({
      mass: this.mass,
      useGravity: this.useGravity,
      isPermeable: this.isPermeable,
      ghost: this.ghost,
      isStatic: this.isStatic,
      drag: this.drag,
    });
  }
}

export default RigidBody;
