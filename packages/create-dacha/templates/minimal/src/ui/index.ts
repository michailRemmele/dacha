import { LoadScene, SceneEntered, SceneExited } from 'dacha/events';
import type { SceneEnteredEvent } from 'dacha/events';
import type { UIOptions, World, Scene } from 'dacha';

import './ui.css';

let overlay: HTMLDivElement | undefined;
let world: World | undefined;
let scene: Scene | undefined;

const handleSceneEntered = (event: SceneEnteredEvent): void => {
  scene = event.scene;
};

const handleSceneExited = (): void => {
  scene = undefined;
};

export const onInit = (options: UIOptions): void => {
  world = options.world;

  world.addEventListener(SceneEntered, handleSceneEntered);
  world.addEventListener(SceneExited, handleSceneExited);

  overlay = document.createElement('div');
  overlay.className = 'ui-overlay';
  overlay.innerHTML = `
    <span class="ui-hint">WASD to move</span>
    <button class="ui-restart" type="button">Restart</button>
  `;

  overlay.querySelector('.ui-restart')?.addEventListener('click', () => {
    if (world !== undefined && scene !== undefined) {
      world.dispatchEvent(LoadScene, { id: scene.id });
    }
  });

  document.body.appendChild(overlay);
};

export const onDestroy = (): void => {
  world?.removeEventListener(SceneEntered, handleSceneEntered);
  world?.removeEventListener(SceneExited, handleSceneExited);

  overlay?.remove();

  overlay = undefined;
  world = undefined;
  scene = undefined;
};
