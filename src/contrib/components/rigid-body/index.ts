import { Component } from '../../../engine/component';
import { Vector2 } from '../../../engine/mathLib';

export type RigidBodyType = 'dynamic' | 'static';

export interface RigidBodyConfig extends Record<string, unknown> {
  type: RigidBodyType
  mass: number
  useGravity: boolean
  drag: number
  isPermeable: boolean
  ghost: boolean
  isPlatform: boolean
  velocity?: Vector2
}

export class RigidBody extends Component {
  type: RigidBodyType;
  mass: number;
  useGravity: boolean;
  isPermeable: boolean;
  ghost: boolean;
  drag: number;
  isPlatform: boolean;
  velocity?: Vector2;

  constructor(config: Record<string, unknown>) {
    super();

    const rigidBodyConfig = config as RigidBodyConfig;

    this.type = rigidBodyConfig.type;
    this.mass = rigidBodyConfig.mass;
    this.useGravity = rigidBodyConfig.useGravity;
    this.isPermeable = rigidBodyConfig.isPermeable;
    this.ghost = rigidBodyConfig.ghost;
    this.drag = rigidBodyConfig.drag;
    this.isPlatform = rigidBodyConfig.isPlatform;
  }

  clone(): RigidBody {
    return new RigidBody({
      mass: this.mass,
      useGravity: this.useGravity,
      isPermeable: this.isPermeable,
      ghost: this.ghost,
      type: this.type,
      drag: this.drag,
      isPlatform: this.isPlatform,
    });
  }
}

RigidBody.componentName = 'RigidBody';
