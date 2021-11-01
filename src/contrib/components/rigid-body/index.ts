import { Component } from '../../../engine/component';

type RigidBodyType = 'dynamic' | 'static';

interface RigidBodyConfig {
  type: RigidBodyType;
  mass: number;
  useGravity: boolean;
  drag: number;
  isPermeable: boolean;
  ghost: boolean;
}

export class RigidBody extends Component {
  private _type: RigidBodyType;
  private _mass: number;
  private _useGravity: boolean;
  private _isPermeable: boolean;
  private _ghost: boolean;
  private _drag: number;

  constructor(componentName: string, config: RigidBodyConfig) {
    super(componentName);

    this._type = config.type;
    this._mass = config.mass;
    this._useGravity = config.useGravity;
    this._isPermeable = config.isPermeable;
    this._ghost = config.ghost;
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

  set type(type) {
    this._type = type;
  }

  get type() {
    return this._type;
  }

  set drag(drag) {
    this._drag = drag;
  }

  get drag() {
    return this._drag;
  }

  clone() {
    return new RigidBody(this.componentName, {
      mass: this.mass,
      useGravity: this.useGravity,
      isPermeable: this.isPermeable,
      ghost: this.ghost,
      type: this.type,
      drag: this.drag,
    });
  }
}
