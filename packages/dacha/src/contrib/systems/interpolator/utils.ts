import type { Actor } from '../../../engine/actor';
import { MathOps } from '../../../engine/math-lib';
import type { Interpolation } from '../../components/interpolation';
import type { LocalTransform } from '../../components/transform/local-transform';
import { RigidBody } from '../../components/rigid-body';

export const snapToTransform = (
  interpolation: Interpolation,
  local: LocalTransform,
): void => {
  interpolation._prevX = local.position.x;
  interpolation._prevY = local.position.y;
  interpolation._prevRotation = local.rotation;
  interpolation._currX = local.position.x;
  interpolation._currY = local.position.y;
  interpolation._currRotation = local.rotation;

  interpolation.renderX = local.position.x;
  interpolation.renderY = local.position.y;
  interpolation.renderRotation = local.rotation;

  interpolation._initialized = true;
  interpolation._snapRequested = false;
};

export const computeRenderValues = (
  actor: Actor,
  interpolation: Interpolation,
  alpha: number,
  fixedDeltaTime: number,
): void => {
  if (interpolation.mode === 'extrapolate') {
    const rigidBody = actor.getComponent(RigidBody) as RigidBody | undefined;

    if (rigidBody !== undefined && !rigidBody.disabled) {
      const timeAhead = alpha * fixedDeltaTime;

      interpolation.renderX =
        interpolation._currX + rigidBody.linearVelocity.x * timeAhead;
      interpolation.renderY =
        interpolation._currY + rigidBody.linearVelocity.y * timeAhead;
      interpolation.renderRotation = rigidBody.lockRotation
        ? interpolation._currRotation
        : interpolation._currRotation + rigidBody.angularVelocity * timeAhead;

      return;
    }
  }

  interpolation.renderX =
    interpolation._prevX +
    (interpolation._currX - interpolation._prevX) * alpha;
  interpolation.renderY =
    interpolation._prevY +
    (interpolation._currY - interpolation._prevY) * alpha;
  interpolation.renderRotation =
    interpolation._prevRotation +
    MathOps.getAngleDelta(
      interpolation._prevRotation,
      interpolation._currRotation,
    ) *
      alpha;
};
