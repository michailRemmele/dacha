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

The [starter project](/getting-started/installation/) includes `UIBridge` and a small interface
in `src/ui/index.ts`.

The bridge gets your module from a loader in the engine's `resources`:

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

`loadUI` returns a promise with the module. If `loadUI` is missing, the bridge throws when the engine creates it.

`UIBridge` must also be in the systems list in the editor. It has no options.

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
| `templateCollection` | The templates defined in the configuration |
| `globalOptions` | The global settings for the game |

`onDestroy` removes everything `onInit` created, including listeners on the world.

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

## The starter interface

The starter project shows a hint and a *Restart* button that loads the current scene again. It
uses plain DOM:

```ts
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
```

The bridge does not create a DOM element for the interface. The starter project adds its own
element to `body` and positions it over the game with CSS.

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

## Input over the interface

The interface covers the canvas, so it can take clicks that the player meant for the game. The
starter project turns this off with CSS. The overlay has `pointer-events: none`, and only the
button has `pointer-events: auto`.

The opposite also happens. The input systems listen on `window` by default, so they also receive
events that happen in the interface:

- A click on an interface button also sends `MouseInput`, and mouse control bindings fire.
- Typing in a text field also sends `KeyboardInput`, and keyboard control bindings fire.

For the mouse, set `windowNodeId` of `MouseInputSystem` to the element that holds the game. Keep
the interface outside that element, as the starter project does. Then clicks on the interface do
not reach the game. See [where input comes from](/systems/input/#where-input-comes-from).

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
