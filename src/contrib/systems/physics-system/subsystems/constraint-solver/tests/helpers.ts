import { Actor } from '../../../../../../engine/actor';
import {
  RigidBody,
  type RigidBodyConfig,
  type RigidBodyType,
} from '../../../../../components/rigid-body';

export const createActor = (
  id: string,
  type: RigidBodyType,
  config: Partial<RigidBodyConfig> = {},
): Actor => {
  const actor = new Actor({ id, name: id });

  actor.setComponent(
    new RigidBody({
      type,
      mass: 1,
      gravityScale: 0,
      linearDamping: 0,
      disabled: false,
      oneWay: false,
      ...config,
    }),
  );

  return actor;
};

export const createActorWithInertia = (
  id: string,
  type: RigidBodyType,
  config: Partial<RigidBodyConfig> = {},
): Actor => {
  const actor = createActor(id, type, config);
  actor.getComponent(RigidBody).inertia = 1;

  return actor;
};
