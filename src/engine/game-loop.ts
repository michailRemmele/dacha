import type { SceneProvider } from './scene';
import type { Controller } from './controllers';
import { eventQueue } from './event-target';

export class GameLoop {
  private sceneProvider: SceneProvider;
  private controllers: Array<Controller>;
  private gameLoopId: number;
  private previous: number;
  private bindedTick: () => void;

  constructor(sceneProvider: SceneProvider, controllers: Array<Controller>) {
    this.sceneProvider = sceneProvider;
    this.controllers = controllers;

    this.gameLoopId = 0;
    this.previous = 0;

    this.bindedTick = this.tick.bind(this);
  }

  private tick(): void {
    eventQueue.update();

    const current = performance.now();

    const elapsed = current - this.previous;

    const currentScene = this.sceneProvider.getCurrentScene();

    const options = {
      deltaTime: elapsed,
    };

    currentScene?.systems.forEach((system) => {
      system.update?.(options);
    });

    this.controllers.forEach((controller) => {
      controller.update();
    });

    this.previous = current;

    this.gameLoopId = requestAnimationFrame(this.bindedTick);
  }

  run(): void {
    this.previous = performance.now();

    this.gameLoopId = requestAnimationFrame(this.bindedTick);
  }

  stop(): void {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
    }
  }
}
