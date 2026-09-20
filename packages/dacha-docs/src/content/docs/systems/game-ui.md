---
title: "Game UI"
description: "Build menus and HUDs with HTML, and connect them to the running game."
---

Menus, health bars and dialogue boxes are usually easier to build with HTML and CSS than with
the renderer. `UIBridge` loads your interface module and starts it together with the game. The
interface is a layer of DOM elements over the canvas.

`UIBridge` does not depend on any framework. Your module exports two functions, and the bridge
calls them. Inside them you can use plain DOM, React, Vue or anything else.

## Setting it up

1. In the Systems tab, add *UIBridge*.
2. Add the class to the engine in `src/index.ts`, and give it a loader for your interface
   module in `resources`:

   ```ts
   import { Engine, UIBridge } from 'dacha';

   const engine = new Engine({
     config,
     systems: [UIBridge, ...gameSystems],
     components: [...gameComponents],
     assets: [],
     resources: {
       [UIBridge.systemName]: {
         loadUI: () => import('./ui'),
       },
     },
   });
   ```

3. Write the module the loader points at. See [the module](#the-module).

`loadUI` returns a promise with the module.

### Order in the systems list

The place of `UIBridge` in the list does not matter.

## The module

Your module exports `onInit` and `onDestroy`:

```ts
import type { UIOptions } from 'dacha';

export const onInit = (options: UIOptions): void => {
  // create the interface
};

export const onDestroy = (): void => {
  // remove the interface and its listeners
};
```

`onInit` receives the running game:

| Field | What it is |
| --- | --- |
| `world` | The world. Use it to dispatch and listen for events, and to reach `systemApi` |
| `actorSpawner` | [Creates actors](/concepts/actors/#creating-and-destroying-actors) from templates |
| `templateCollection` | The available templates |
| `globalOptions` | The global settings for the game |

## When it runs

`engine.play()` starts the game in this order:

1. World systems load. `UIBridge` calls `loadUI` at this step.
2. `UIBridge` calls `onInit`, after every world system has loaded.
3. The start scene loads and becomes active.

So no scene is active when `onInit` runs. If the interface needs the scene, listen for
`SceneEntered` on the world.

`UIBridge` is a world system, so the interface stays on screen when the game changes scenes.
`engine.stop()` calls `onDestroy`. `engine.pause()` does not.

The editor does not run your interface. To see it, open the game in the browser.

## Talking to the game

The interface uses the same tools as the rest of your code.

**To change the game**, dispatch an event on the world. That can be an engine event, such as
`LoadScene`, or [one of your own](/concepts/events/#declaring-your-own-events). A system listens
for it and does the work.

**To show game state**, listen for events on the world. An event dispatched on an actor climbs to
the world while its scene is active, so the interface can listen for `Damaged` on the world and
update a health bar.

**To read or set shared state**, use `world.systemApi`. For example, a volume slider can call
`AudioAPI`:

```ts
import { AudioAPI } from 'dacha';

slider.addEventListener('input', () => {
  world.systemApi.get(AudioAPI).setGroupVolume('music', Number(slider.value));
});
```

## With React

The module is the same with a framework. Create the root in `onInit` and remove it in
`onDestroy`:

```tsx
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import type { UIOptions } from 'dacha';

import { App } from './app';

let container: HTMLDivElement | undefined;
let root: Root | undefined;

export const onInit = (options: UIOptions): void => {
  container = document.createElement('div');
  container.className = 'ui-overlay';
  document.body.appendChild(container);

  root = createRoot(container);
  root.render(<App uiOptions={options} />);
};

export const onDestroy = (): void => {
  root?.unmount();
  container?.remove();

  root = undefined;
  container = undefined;
};
```

Vue, Svelte and other
frameworks work the same way: mount in `onInit`, unmount in `onDestroy`.
