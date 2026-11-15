---
title: "Game UI"
description: "Build menus and HUDs with HTML, and connect them to the running game."
---

Menus, health bars and dialogue boxes are usually easier to build with HTML and CSS than with
the renderer. `UIBridge` runs your interface together with the game. The interface is a layer
of DOM elements over the canvas.

`UIBridge` does not depend on any framework. Your interface is a module with two functions, and
the bridge calls them. Inside them you can use plain DOM, React, Vue or anything else.

## Setting it up

1. In the Systems tab, add *UIBridge*.
2. Add the system to the engine in `src/index.ts`. Give it a function that loads your interface
   module, with `with`:

   ```ts
   import { Engine, UIBridge } from 'dacha';

   const engine = new Engine({
     config,
     systems: [
       UIBridge.with({ loadUI: () => import('./ui') }),
       ...gameSystems,
     ],
     components: [...gameComponents],
     assets: [],
   });
   ```

3. Write the interface module. See [the interface module](#the-interface-module).

### Order in the systems list

The place of `UIBridge` in the systems list does not matter.

## The interface module

The module that `loadUI` returns exports two functions:

```ts
import type { UIContext } from 'dacha';

export const onInit = (context: UIContext): void => {
  // Create the interface.
};

export const onDestroy = (): void => {
  // Remove it.
};
```

`onDestroy` is optional.

## Settings of the interface

An interface needs scenes, assets and templates of the project: the scene of the main menu, the
sound of a click. Declare them as fields of the system.

Write a system that extends `UIBridge` and has the fields:

```ts
// src/systems/game-ui.system.ts
import { UIBridge, DefineSystem, DefineField } from 'dacha';

@DefineSystem({ name: 'GameUI' })
export default class GameUI extends UIBridge {
  @DefineField({ type: 'scene' })
  mainMenu = '';

  @DefineField({ type: 'asset', kind: 'audio' })
  clickSound = '';
}
```

Use it in place of `UIBridge`, in the engine and in the Systems tab:

```ts
GameUI.with({ loadUI: () => import('./ui') }),
```

Fields work as in any system. See [Inspector fields](/game-code/inspector-fields/).

The interface reads the values from `context.options`:

```ts
import { LoadScene } from 'dacha/events';
import type { UIContext } from 'dacha';

import type GameUI from './game-ui.system';

type Options = Pick<GameUI, 'mainMenu' | 'clickSound'>;

export const onInit = (context: UIContext<Options>): void => {
  menuButton.addEventListener('click', () => {
    context.world.dispatchEvent(LoadScene, { id: context.options.mainMenu });
  });
};
```

## When it runs

`engine.play()` starts the game in this order:

1. World systems load. `UIBridge` loads the interface module at this step.
2. `UIBridge` calls `onInit` of the module, after every world system has loaded.
3. The start scene loads and becomes active.

So no scene is active when `onInit` runs. To react when a scene starts, see
[following the active scene](#following-the-active-scene).

The editor does not run your interface. To see it, open the game in the browser.

## The context

`onInit` receives a `UIContext`:

| Field | What it is |
| --- | --- |
| `world` | The world. Use it to dispatch events and to reach `systemApi` |
| `assets` | The [project assets](/concepts/assets/) |
| `options` | The values of the fields. See [settings of the interface](#settings-of-the-interface) |
| `scene` | The active scene, or `undefined` between scenes |
| `watch` | Follows a value of the game |
| `on` | Listens for an event on the world |

### Following game state

`watch` takes a selector, a function that reads a value of the game. The bridge runs the
selector every frame while the value has listeners. It calls the listeners only when the value
changes.

The selector gets `find`. It returns the first actor of the active scene that has all the given
components:

```ts
const health = context.watch(({ find }) =>
  find([Player, Health])?.getComponent(Health).value,
);

health.subscribe((value) => {
  healthBar.style.width = `${value ?? 0}%`;
});
```

The bridge compares values with `Object.is`. Two arrays are equal when their items are equal. Return
numbers, strings, other simple values or arrays of them from a selector. If a selector returns a
new object every frame, pass a compare function as the second argument of `watch`. Otherwise
the listeners run every frame.

`findAll` returns all the actors that have the components, as an array:

```ts
const enemies = context.watch(({ findAll }) => findAll([Enemy]));

enemies.subscribe((actors) => {
  counter.textContent = String(actors.length);
});
```

The value `watch` returns has two methods:

- `get()` returns the current value.
- `subscribe(listener)` calls `listener` with the current value now and again on every change.
  It returns a function that stops the listener.

### Following the active scene

`context.scene` is the active scene at the moment you read it. To react when it changes, watch
it:

```ts
context.watch(({ scene }) => scene).subscribe((scene) => {
  title.textContent = scene?.name ?? '';
});
```

### Listening for events

`on` adds a listener on the world and returns a function that removes it:

```ts
context.on(GameOver, (event) => {
  showGameOver(event.isWin);
});
```

An event dispatched on an actor reaches the world while its scene is active, so the interface
can listen for it on the world.

## Talking to the game

**To change the game**, dispatch an event. That can be an engine event, such as `LoadScene`,
or [one of your own](/concepts/events/#declaring-your-own-events):

```ts
restartButton.addEventListener('click', () => {
  const { scene } = context;
  if (scene) {
    context.world.dispatchEvent(LoadScene, { id: scene.id });
  }
});
```

**To read or set shared state**, use `world.systemApi`. For example, a volume slider can call
`AudioAPI`:

```ts
import { AudioAPI } from 'dacha';

slider.addEventListener('input', () => {
  context.world.systemApi
    .get(AudioAPI)
    .setGroupVolume('music', Number(slider.value));
});
```

## With React

Mount the app in `onInit` and unmount it in `onDestroy`:

```tsx
// src/ui/index.tsx
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import type { UIContext } from 'dacha';

import { App } from './app';

let container: HTMLDivElement | undefined;
let root: Root | undefined;

export const onInit = (context: UIContext): void => {
  container = document.createElement('div');
  container.className = 'ui-overlay';
  document.body.appendChild(container);

  root = createRoot(container);
  root.render(<App context={context} />);
};

export const onDestroy = (): void => {
  root?.unmount();
  container?.remove();

  root = undefined;
  container = undefined;
};
```

Vue, Svelte and other frameworks work the same way: mount in `onInit`, unmount in `onDestroy`.

## API reference

- [`UIBridge`](/api/classes/UIBridge.html)
- [`UIContext`](/api/interfaces/UIContext.html)
- [`UIValue`](/api/interfaces/UIValue.html)
