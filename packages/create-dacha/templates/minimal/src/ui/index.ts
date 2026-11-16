import { LoadScene } from 'dacha/events';
import type { UIContext } from 'dacha';

import './ui.css';

let overlay: HTMLDivElement | undefined;

export const onInit = (context: UIContext): void => {
  overlay = document.createElement('div');
  overlay.className = 'ui-overlay';
  overlay.innerHTML = `
    <span class="ui-hint">WASD to move</span>
    <button class="ui-restart" type="button">Restart</button>
  `;

  overlay.querySelector('.ui-restart')?.addEventListener('click', () => {
    const { scene } = context;
    if (scene !== undefined) {
      context.world.dispatchEvent(LoadScene, { id: scene.id });
    }
  });

  document.body.appendChild(overlay);
};

export const onDestroy = (): void => {
  overlay?.remove();
  overlay = undefined;
};
