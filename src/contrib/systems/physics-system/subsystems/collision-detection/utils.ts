import { RigidBody, Collider } from '../../../../components';

import type { ActorProxy } from './types';
import { INTERSECTION_EPSILON } from './constants';

export const isZero = (value: number): boolean =>
  Math.abs(value) <= INTERSECTION_EPSILON;

export const isDefinitelyPositive = (value: number): boolean =>
  value > INTERSECTION_EPSILON;

export const isDefinitelyNegative = (value: number): boolean =>
  value < -INTERSECTION_EPSILON;

export const isGreaterThan = (left: number, right: number): boolean =>
  isDefinitelyPositive(left - right);

export const isLessThan = (left: number, right: number): boolean =>
  isDefinitelyNegative(left - right);

export const isStatic = (proxy: ActorProxy): boolean => {
  const rigidBody = proxy.actor.getComponent(RigidBody) as
    | RigidBody
    | undefined;

  return rigidBody?.type === 'static';
};

export const isDisabled = (proxy: ActorProxy): boolean => {
  const collider = proxy.actor.getComponent(Collider) as Collider | undefined;

  return collider?.disabled === true;
};
