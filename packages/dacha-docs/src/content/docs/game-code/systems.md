---
title: "Systems"
description: "Define a system, query the actors it acts on, and hook it into the loop."
---

A system holds logic that runs as part of the game loop. You declare one by extending
`SceneSystem` or `WorldSystem` and naming it with a decorator.

Most systems act on actors and find them with a query, which is what the example below
does. Not all of them do. The built-in `UIBridge` connects the engine to your interface
layer and never looks at an actor. Every hook is optional too, so a system that only reacts
to events implements neither `update` nor `fixedUpdate`.

Pick the base class by asking whether the system must survive a scene change. If yes,
`WorldSystem`; if no, `SceneSystem`. [Systems](/concepts/systems/) has the full comparison.

## A complete system

```ts
import { ActorQuery, SceneSystem, CharacterBody } from 'dacha';
import type { Scene, SceneSystemOptions } from 'dacha';
import { DefineSystem } from 'dacha-workbench/decorators';

import Movement from '../../components/movement/movement.component';
import { MoveRequest } from '../../events';
import type { MoveRequestEvent } from '../../events';

@DefineSystem({
  name: 'MovementSystem',
})
export default class MovementSystem extends SceneSystem {
  private scene: Scene;
  private actorQuery: ActorQuery;

  constructor(options: SceneSystemOptions) {
    super();

    this.scene = options.scene;

    this.actorQuery = new ActorQuery({
      scene: options.scene,
      filter: [Movement, CharacterBody],
    });

    this.scene.addEventListener(MoveRequest, this.handleMoveRequest);
  }

  onSceneDestroy(): void {
    this.scene.removeEventListener(MoveRequest, this.handleMoveRequest);
  }

  private handleMoveRequest = (event: MoveRequestEvent): void => {
    const movement = event.target.getComponent(Movement);
    if (!movement) {
      return;
    }

    movement.direction = event.direction;
  };

  fixedUpdate(): void {
    for (const actor of this.actorQuery.getActors()) {
      const movement = actor.getComponent(Movement);
      const body = actor.getComponent(CharacterBody);

      body.velocity.x = movement.direction * movement.speed;
    }
  }
}
```

That file follows three rules [the systems page](/concepts/systems/) explains in full. The
query is built once and kept. It is never destroyed, because it dies with its scene. The
listener added in the constructor comes off in `onSceneDestroy`, which matters most for a
listener you put on the **world**, since that one outlives the system.

One detail is a choice rather than a rule. **Movement sits in `fixedUpdate`, not `update`.**
Anything whose outcome must not depend on frame rate goes on the fixed clock. See
[the game loop](/concepts/game-loop/).

## Settings you can change in the editor

A system reads its own settings from the same options object, and the field decorator puts
them in the editor:

```ts
import { SceneSystem } from 'dacha';
import type { SceneSystemOptions } from 'dacha';
import { DefineSystem, DefineField } from 'dacha-workbench/decorators';

interface SpawnerOptions extends SceneSystemOptions {
  spawnInterval: number;
  maxEnemies: number;
}

@DefineSystem({
  name: 'SpawnerSystem',
})
export default class SpawnerSystem extends SceneSystem {
  @DefineField({ initialValue: 2 })
  spawnInterval: number;

  @DefineField({ initialValue: 10 })
  maxEnemies: number;

  constructor(options: SpawnerOptions) {
    super();

    this.spawnInterval = options.spawnInterval;
    this.maxEnemies = options.maxEnemies;
  }
}
```

The decorator works the same way it does on a component, and
[inspector fields](/game-code/inspector-fields/) applies here too. The difference is where
the values live. A component's fields belong to one actor and are edited in the inspector.
A system's settings belong to the whole game and are edited under
[systems & global options](/editor/systems-and-options/).

:::caution
The engine merges your options first and its own fields second. A setting named `scene`,
`world`, `time`, `assets`, `actorSpawner`, `globalOptions`, `resources` or
`templateCollection` is overwritten before your constructor runs. Give settings names of
their own.
:::

## Loading before the scene starts

`onSceneLoad` is async, and the engine waits for it. Use it for anything that must be in
memory before the first frame:

```ts
private level?: LevelData;

async onSceneLoad(): Promise<void> {
  const response = await fetch('/data/levels/forest.json');
  this.level = (await response.json()) as LevelData;
}
```

Every system's `onSceneLoad` runs at the same time, and the scene becomes active only when
all of them have resolved. So a slow one delays the scene for everybody. `onWorldLoad` is
the same hook for a world system, and it runs once for the whole game.

## Publishing an API

A world system that other code needs to reach registers an API object. The API is a plain
class with no decorator and no file-name suffix. Its constructor is the key other systems
look it up by:

```ts
import { WorldSystem } from 'dacha';
import type { WorldSystemOptions } from 'dacha';
import { DefineSystem } from 'dacha-workbench/decorators';

export class ScoreAPI {
  points = 0;

  add(value: number): void {
    this.points += value;
  }
}

@DefineSystem({
  name: 'ScoreSystem',
})
export default class ScoreSystem extends WorldSystem {
  constructor(options: WorldSystemOptions) {
    super();

    options.world.systemApi.register(new ScoreAPI());
  }
}
```

A world system registers in its constructor, because it is built once and lives as long as
the world. A scene system cannot do that. It is rebuilt for every scene, and `register`
throws when the same class is already registered, so a scene system registers in
`onSceneEnter` and unregisters in `onSceneExit`. The built-in physics system does exactly
that.

## Reaching another system

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
[auto-registration convention](/game-code/auto-registration/) collects it.

The system also has to be listed in the configuration for it to run, which the editor does
for you under [systems & global options](/editor/systems-and-options/). Order matters there: a
system that reads what another writes must come after it.
