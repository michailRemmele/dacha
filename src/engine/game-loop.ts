import type { SceneProvider } from './scene';
import type { Controller } from './controllers';
import { eventQueue } from './event-target';

const MS_PER_UPDATE = 1000 / 50;

export class GameLoop {
  private sceneProvider: SceneProvider;
  private controllers: Array<Controller>;
  private gameLoopId: number;
  private previous: number;
  private lag: number;
  private bindedTick: () => void;

  constructor(sceneProvider: SceneProvider, controllers: Array<Controller>) {
    this.sceneProvider = sceneProvider;
    this.controllers = controllers;

    this.gameLoopId = 0;
    this.previous = 0;
    this.lag = 0;

    this.bindedTick = this.tick.bind(this);
  }

  private tick(): void {
    eventQueue.update();

    const current = performance.now();

    const elapsed = current - this.previous;
    this.lag += elapsed;

    const currentScene = this.sceneProvider.getCurrentScene();

    const fixedUpdateOptions = { deltaTime: MS_PER_UPDATE };
    while (this.lag >= MS_PER_UPDATE) {
      currentScene?.systems.forEach((system) => {
        system.fixedUpdate?.(fixedUpdateOptions);
      });
      this.lag -= MS_PER_UPDATE;
    }

    const options = { deltaTime: elapsed };
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
    this.lag = 0;

    this.lag = 0;

    this.gameLoopId = requestAnimationFrame(this.bindedTick);
  }

  stop(): void {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
    }
  }
}
