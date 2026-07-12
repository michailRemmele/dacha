import { ActorQuery } from '../../../engine/actor';
import { SceneSystem } from '../../../engine/system';
import type { SceneSystemOptions } from '../../../engine/system';
import type { Time } from '../../../engine/time';
import type { World } from '../../../engine/world';
import { Interpolation } from '../../components/interpolation';
import { Transform } from '../../components/transform';

import { InterpolatorAPI } from './api';
import { snapToTransform, computeRenderValues } from './utils';

/**
 * System that produces smooth render-facing transforms for actors moved
 * during fixed updates.
 *
 * During `fixedUpdate` it snapshots the local Transform of every actor with
 * an Interpolation component. During `update` it blends the last two
 * snapshots using `Time.alpha` and writes the result into the component's
 * `renderX`/`renderY`/`renderRotation`, which the renderer prefers over the
 * Transform.
 *
 * Ordering: place this system AFTER every system that moves transforms in
 * fixed updates (`PhysicsSystem`, `CharacterController`, behavior scripts
 * that move actors in `fixedUpdate`) and BEFORE `Renderer` in the system
 * configuration.
 *
 * @category Systems
 */
export class Interpolator extends SceneSystem {
  private actorQuery: ActorQuery;
  private time: Time;
  private world: World;
  private api: InterpolatorAPI;

  constructor(options: SceneSystemOptions) {
    super();

    this.time = options.time;
    this.world = options.world;
    this.actorQuery = new ActorQuery({
      scene: options.scene,
      filter: [Interpolation, Transform],
    });
    this.api = new InterpolatorAPI({ time: options.time });
  }

  onSceneEnter(): void {
    this.world.systemApi.register(this.api);
  }

  onSceneExit(): void {
    this.world.systemApi.unregister(InterpolatorAPI);
  }

  onSceneDestroy(): void {
    this.actorQuery.destroy();
  }

  fixedUpdate(): void {
    for (const actor of this.actorQuery.getActors()) {
      const interpolation = actor.getComponent(Interpolation);
      const { local } = actor.getComponent(Transform);

      if (interpolation.disabled) {
        interpolation._initialized = false;
        continue;
      }

      if (!interpolation._initialized || interpolation._snapRequested) {
        snapToTransform(interpolation, local);
        continue;
      }

      interpolation._prevX = interpolation._currX;
      interpolation._prevY = interpolation._currY;
      interpolation._prevRotation = interpolation._currRotation;
      interpolation._currX = local.position.x;
      interpolation._currY = local.position.y;
      interpolation._currRotation = local.rotation;

      const threshold = interpolation.snapThreshold;
      if (threshold > 0) {
        const dx = interpolation._currX - interpolation._prevX;
        const dy = interpolation._currY - interpolation._prevY;

        if (dx * dx + dy * dy > threshold * threshold) {
          interpolation._prevX = interpolation._currX;
          interpolation._prevY = interpolation._currY;
          interpolation._prevRotation = interpolation._currRotation;
        }
      }
    }
  }

  update(): void {
    const { alpha, fixedDeltaTime } = this.time;

    for (const actor of this.actorQuery.getActors()) {
      const interpolation = actor.getComponent(Interpolation);

      if (interpolation.disabled) {
        continue;
      }

      if (interpolation._snapRequested) {
        snapToTransform(interpolation, actor.getComponent(Transform).local);
        continue;
      }

      if (!interpolation._initialized) {
        continue;
      }

      computeRenderValues(actor, interpolation, alpha, fixedDeltaTime);
    }
  }
}

Interpolator.systemName = 'Interpolator';
