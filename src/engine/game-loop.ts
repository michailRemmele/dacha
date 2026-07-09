import type { SceneManager } from './scene';
import type { UpdateContext, FixedUpdateContext } from './system';
import { eventQueue } from './event-target';
import {
  DEFAULT_FIXED_UPDATE_RATE,
  DEFAULT_MAX_FPS,
  DEFAULT_MAX_FRAME_DELTA,
  DEFAULT_MAX_FIXED_UPDATES_PER_FRAME,
} from './consts';

export interface PerformanceSettings {
  maxFPS?: number;
  fixedUpdateRate?: number;
  maxFrameDelta?: number;
  maxFixedUpdatesPerFrame?: number;
}

export class GameLoop {
  private sceneManager: SceneManager;

  private msPerUpdate: number;
  private msPerFixedUpdate: number;
  private maxFrameDelta: number;
  private maxFixedUpdatesPerFrame: number;

  private gameLoopId: number;
  private previous: number;
  private lag: number;
  private elapsedMs: number;
  private fixedElapsedMs: number;
  private bindedTick: () => void;

  private fixedUpdateContext: FixedUpdateContext;
  private updateContext: UpdateContext;

  constructor(sceneManager: SceneManager, performance?: PerformanceSettings) {
    this.sceneManager = sceneManager;

    this.msPerUpdate = 1000 / (performance?.maxFPS || DEFAULT_MAX_FPS);
    this.msPerFixedUpdate =
      1000 / (performance?.fixedUpdateRate || DEFAULT_FIXED_UPDATE_RATE);
    this.maxFrameDelta = performance?.maxFrameDelta || DEFAULT_MAX_FRAME_DELTA;
    this.maxFixedUpdatesPerFrame =
      performance?.maxFixedUpdatesPerFrame ||
      DEFAULT_MAX_FIXED_UPDATES_PER_FRAME;

    this.gameLoopId = 0;
    this.previous = 0;
    this.lag = 0;
    this.elapsedMs = 0;
    this.fixedElapsedMs = 0;

    this.fixedUpdateContext = {
      deltaTime: this.msPerFixedUpdate / 1000,
      deltaTimeMs: this.msPerFixedUpdate,
      elapsedTime: 0,
    };
    this.updateContext = {
      deltaTime: 0,
      deltaTimeMs: 0,
      elapsedTime: 0,
      alpha: 0,
    };

    this.bindedTick = this.tick.bind(this);
  }

  private tick(): void {
    this.gameLoopId = requestAnimationFrame(this.bindedTick);

    const current = performance.now();
    const elapsed = Math.min(current - this.previous, this.maxFrameDelta);

    if (elapsed < this.msPerUpdate) {
      return;
    }

    this.lag += elapsed;

    eventQueue.update();

    const systems = this.sceneManager.getSystems();

    let fixedUpdates = 0;

    while (
      this.lag >= this.msPerFixedUpdate &&
      fixedUpdates < this.maxFixedUpdatesPerFrame
    ) {
      this.fixedElapsedMs += this.msPerFixedUpdate;
      this.fixedUpdateContext.elapsedTime = this.fixedElapsedMs / 1000;

      systems.forEach((system) => {
        system.fixedUpdate?.(this.fixedUpdateContext);
      });

      this.lag -= this.msPerFixedUpdate;
      fixedUpdates += 1;
    }

    if (fixedUpdates === this.maxFixedUpdatesPerFrame) {
      this.lag = 0;
    }

    this.elapsedMs += elapsed;
    this.updateContext.deltaTime = elapsed / 1000;
    this.updateContext.deltaTimeMs = elapsed;
    this.updateContext.elapsedTime = this.elapsedMs / 1000;
    this.updateContext.alpha = this.lag / this.msPerFixedUpdate;

    systems.forEach((system) => {
      system.update?.(this.updateContext);
    });

    if (this.msPerUpdate > 0) {
      this.previous = current - (elapsed % this.msPerUpdate);
    } else {
      this.previous = current;
    }
  }

  run(): void {
    if (this.gameLoopId) {
      return;
    }

    this.previous = performance.now();
    this.lag = 0;
    this.elapsedMs = 0;
    this.fixedElapsedMs = 0;

    this.gameLoopId = requestAnimationFrame(this.bindedTick);
  }

  stop(): void {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = 0;
    }
  }
}
