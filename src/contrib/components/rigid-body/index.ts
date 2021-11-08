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
  type: RigidBodyType;
  mass: number;
  useGravity: boolean;
  isPermeable: boolean;
  ghost: boolean;
  drag: number;

  constructor(componentName: string, config: RigidBodyConfig) {
    super(componentName);

    this.type = config.type;
    this.mass = config.mass;
    this.useGravity = config.useGravity;
    this.isPermeable = config.isPermeable;
    this.ghost = config.ghost;
    this.drag = config.drag;
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
