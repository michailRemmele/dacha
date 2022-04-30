import type { SceneProvider } from '../scene';

export interface Controller {
  update(): void
}

export interface ControllerOptions {
  sceneProvider: SceneProvider
}
