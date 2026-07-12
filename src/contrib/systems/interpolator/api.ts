import type { Actor } from '../../../engine/actor';
import type { Time } from '../../../engine/time';
import { Matrix } from '../../../engine/math-lib';
import { Interpolation } from '../../components/interpolation';
import { Transform } from '../../components/transform';

import { computeRenderValues } from './utils';

export interface RenderTransform {
  x: number;
  y: number;
  rotation: number;
}

interface InterpolatorAPIOptions {
  time: Time;
}

/**
 * Public API for reading render-facing (visually smoothed) transforms.
 *
 * Retrieve it via `world.systemApi.get(InterpolatorAPI)`. Use it in
 * systems and behaviors that position visuals against moving actors —
 * e.g. a camera-follow script — instead of reading the authoritative
 * Transform, which advances in fixed steps.
 *
 * Values are computed from the current `Time.alpha`, so this API is only
 * meaningful during the update phase (not inside `fixedUpdate`).
 *
 * @category Systems
 */
export class InterpolatorAPI {
  private time: Time;

  constructor(options: InterpolatorAPIOptions) {
    this.time = options.time;
  }

  /**
   * Returns the world-space transform the actor is rendered with this
   * frame. Falls back to the Transform for actors (and
   * ancestors) without an active Interpolation component.
   */
  getRenderTransform(actor: Actor): RenderTransform {
    const matrix = this.composeRenderWorldMatrix(actor);

    return {
      x: matrix.tx,
      y: matrix.ty,
      rotation: Math.atan2(matrix.b, matrix.a),
    };
  }

  /**
   * Requests an immediate visual jump to the actor's
   * Transform. Call right after teleporting the actor.
   */
  snap(actor: Actor): void {
    const interpolation = actor.getComponent(Interpolation) as
      | Interpolation
      | undefined;

    interpolation?.snap();
  }

  private composeRenderWorldMatrix(actor: Actor): Matrix {
    const transform = actor.getComponent(Transform);
    const interpolation = actor.getComponent(Interpolation) as
      | Interpolation
      | undefined;

    const useRender =
      interpolation !== undefined &&
      !interpolation.disabled &&
      interpolation.initialized;

    if (useRender) {
      computeRenderValues(
        actor,
        interpolation,
        this.time.alpha,
        this.time.fixedDeltaTime,
      );
    }

    const x = useRender ? interpolation.renderX : transform.local.position.x;
    const y = useRender ? interpolation.renderY : transform.local.position.y;
    const rotation = useRender
      ? interpolation.renderRotation
      : transform.local.rotation;
    const { scale } = transform.local;

    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    const localMatrix = new Matrix(
      cos * scale.x,
      sin * scale.x,
      -sin * scale.y,
      cos * scale.y,
      x,
      y,
    );

    const parentTransform = transform.getParentComponent();

    if (!parentTransform?.actor) {
      return localMatrix;
    }

    const result = new Matrix(1, 0, 0, 1, 0, 0);
    Matrix.multiply(
      result,
      this.composeRenderWorldMatrix(parentTransform.actor),
      localMatrix,
    );

    return result;
  }
}
