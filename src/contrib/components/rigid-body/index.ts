import { Component } from '../../../engine/component';

export type RigidBodyType = 'dynamic' | 'static';

export interface RigidBodyConfig extends Record<string, unknown> {
  type: RigidBodyType
  mass: number
  useGravity: boolean
  drag: number
  isPermeable: boolean
  ghost: boolean
}

export class RigidBody extends Component {
  type: RigidBodyType;
  mass: number;
  useGravity: boolean;
  isPermeable: boolean;
  ghost: boolean;
  drag: number;

  constructor(config: Record<string, unknown>) {
    super();

    const rigidBodyConfig = config as RigidBodyConfig;

    this.type = rigidBodyConfig.type;
    this.mass = rigidBodyConfig.mass;
    this.useGravity = rigidBodyConfig.useGravity;
    this.isPermeable = rigidBodyConfig.isPermeable;
    this.ghost = rigidBodyConfig.ghost;
    this.drag = rigidBodyConfig.drag;
  }

  clone(): RigidBody {
    return new RigidBody({
      mass: this.mass,
      useGravity: this.useGravity,
      isPermeable: this.isPermeable,
      ghost: this.ghost,
      type: this.type,
      drag: this.drag,
    });
  }
}
