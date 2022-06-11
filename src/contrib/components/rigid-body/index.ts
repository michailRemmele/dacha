import { Component } from '../../../engine/component';

export type RigidBodyType = 'dynamic' | 'static';

export type RigidBodyConfig = {
  type: RigidBodyType;
  mass: number;
  useGravity: boolean;
  drag: number;
  isPermeable: boolean;
  ghost: boolean;
};

export class RigidBody extends Component {
  type: RigidBodyType;
  mass: number;
  useGravity: boolean;
  isPermeable: boolean;
  ghost: boolean;
  drag: number;

  constructor(componentName: string, config: Record<string, unknown>) {
    super(componentName);

    const rigidBodyConfig = config as RigidBodyConfig;

    this.type = rigidBodyConfig.type;
    this.mass = rigidBodyConfig.mass;
    this.useGravity = rigidBodyConfig.useGravity;
    this.isPermeable = rigidBodyConfig.isPermeable;
    this.ghost = rigidBodyConfig.ghost;
    this.drag = rigidBodyConfig.drag;
  }

  clone(): RigidBody {
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
