---
title: "Writing a system"
description: "Define a system, query the actors it acts on, and hook it into the loop."
---

A system holds logic. You declare one by extending `SceneSystem` or `WorldSystem`,
describing it with a decorator, and building a query for the actors it cares about.

Pick the base class by asking whether the system must survive a scene change. If yes,
`WorldSystem`; if no, `SceneSystem`. [Systems: World vs Scene](/concepts/systems/) has the
full comparison.

## A complete system

```ts
import { ActorQuery, SceneSystem, CharacterBody } from 'dacha';
import type { Scene, SceneSystemOptions, Time } from 'dacha';
import { DefineSystem } from 'dacha-workbench/decorators';

import Movement from '../../components/movement/movement.component';
import { MovementEvent } from '../../events';

@DefineSystem({
  name: 'MovementSystem',
})
export default class MovementSystem extends SceneSystem {
  private scene: Scene;
  private actorQuery: ActorQuery;
  private time: Time;

  constructor(options: SceneSystemOptions) {
    super();

    this.scene = options.scene;
    this.time = options.time;

    this.actorQuery = new ActorQuery({
      scene: options.scene,
      filter: [Movement, CharacterBody],
    });

    this.scene.addEventListener(MovementEvent, this.handleMovement);
  }

  onSceneDestroy(): void {
    this.scene.removeEventListener(MovementEvent, this.handleMovement);
    this.actorQuery.destroy();
  }

  private handleMovement = (event: MovementEvent): void => {
    const movement = event.target.getComponent(Movement);
    if (!movement) {
      return;
    }
    // record the requested direction
  };

  fixedUpdate(): void {
    for (const actor of this.actorQuery.getActors()) {
      const movement = actor.getComponent(Movement);
      const body = actor.getComponent(CharacterBody);
      // apply movement
    }
  }
}
```

## Reading it line by line

**`@DefineSystem({ name: 'MovementSystem' })`** gives the system the name used in the
configuration. As with components, the decorator is how a system is named.

**`SceneSystemOptions`** carries `scene`, `world`, `time`, `actorSpawner`,
`templateCollection`, `globalOptions` and `resources`. A `WorldSystem` gets the same minus
`scene`. Pull out what you need in the constructor and keep it.

**The query is built once**, in the constructor, and reused. It keeps itself current as
actors are added and removed, so rebuilding it every frame is wasted work. `getActors()`
returns a `Set`.

**Listeners registered in the constructor are removed in `onSceneDestroy`.** This is the
most common leak in a dacha project. A scene system is constructed again every time its
scene loads, so a listener that is never removed accumulates one copy per level restart.
The query subscribes to the scene as well, which is what `destroy()` is for.

**Movement is in `fixedUpdate`, not `update`.** Anything whose outcome must not depend on
frame rate goes on the fixed clock. See [the game loop](/concepts/game-loop/).

## Reaching a built-in system

Systems do not hold references to each other. Ask the world for the API instead:

```ts
import { PhysicsAPI } from 'dacha';

const physics = this.world.systemApi.get(PhysicsAPI);
```

Resolve it where you use it rather than in the constructor, because the providing system
registers its API as it starts up and may not have done so yet. See
[Scenes, World & systemApi](/concepts/scenes-and-world/).

## Registering it

Nothing, if the file is named `*.system.ts` and the class is the default export. The
[auto-registration convention](/writing-game-code/auto-registration/) collects it.

The system also has to be listed in the configuration for it to run, which the editor does
for you under [configuring systems](/editor/systems-and-options/). Order matters there: a
system that reads what another writes must come after it.

:::note
Decorators are currently imported from `dacha-workbench/decorators`. They are planned to
move into the `dacha` package. When that happens this import path changes and these pages
will be updated.
:::
