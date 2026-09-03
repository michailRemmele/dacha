---
title: "Game UI"
description: "Mount an interface alongside the running game, in any framework."
---

Menus, health bars and dialogue boxes are usually easier to build with ordinary web
technology than with the renderer. The user interface bridge loads an external interface
module and manages its lifecycle alongside the world.

It is framework-agnostic. It has no opinion about React, Vue or anything else; it requires
two exported functions.

## The contract

Your interface module must export an initialiser and a teardown function:

```ts
interface UIOptions {
  world: World;
  templateCollection: TemplateCollection;
  actorSpawner: ActorSpawner;
  globalOptions: Record<string, unknown>;
}

export function onInit(options: UIOptions): void;
export function onDestroy(): void;
```

`onInit` runs when the bridge starts and receives direct access to the running game:

| Field | What it gives you |
| --- | --- |
| `world` | The live world, including `systemApi` and event dispatch |
| `templateCollection` | The templates defined in the configuration |
| `actorSpawner` | Creates actors at runtime |
| `globalOptions` | The game's global settings |

`onDestroy` runs on shutdown and must clean up whatever `onInit` created.

## Registering it

The bridge is a world system, so the interface survives scene changes. It takes a loader
in `resources`:

```ts
import { Engine, UIBridge } from 'dacha';

const engine = new Engine({
  config,
  systems: [UIBridge],
  components: [],
  resources: {
    [UIBridge.systemName]: {
      loadUI: () => import('./ui/index'),
    },
  },
});
```

`loadUI` returns a promise resolving to the module, so the interface is code-split and not
part of the initial bundle. The bridge throws at construction if the loader is missing.

## With no framework at all

The contract is small enough to satisfy with plain DOM, which is the clearest way to see
what it actually requires:

```ts
import type { UIOptions } from 'dacha';

let root: HTMLElement | null = null;

export function onInit(options: UIOptions): void {
  root = document.getElementById('ui-root');
  if (!root) {
    return;
  }

  const button = document.createElement('button');
  button.textContent = 'Restart';
  button.addEventListener('click', () => {
    options.world.dispatchEvent(RestartRequested);
  });

  root.append(button);
}

export function onDestroy(): void {
  root?.replaceChildren();
  root = null;
}
```

The interface talks to the game the same way any other code does: through world events and
the system APIs.

## With React

```tsx
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import type { UIOptions } from 'dacha';

import { App } from './app';

let root: Root | undefined;

export function onInit(options: UIOptions): void {
  const node = document.getElementById('ui-root');
  if (!node) {
    return;
  }

  root = createRoot(node);
  root.render(<App uiOptions={options} />);
}

export function onDestroy(): void {
  root?.unmount();
  root = undefined;
}
```

Passing `uiOptions` down through a context provider is the usual arrangement, so any
component can reach the world without prop drilling.

## With something else

Vue, Svelte, Solid or a template library all work the same way: mount in `onInit`, unmount
in `onDestroy`. Nothing in the bridge inspects what you built.

## Layout

The bridge does not create a DOM node for you. Your page needs an element for the interface
to mount into, positioned over the game canvas by your own CSS. The examples above assume
one with the id `ui-root`.
