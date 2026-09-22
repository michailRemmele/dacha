---
title: "Performance"
description: "Measure a Dacha game and tune the settings that matter."
---

Measure before you change anything. A game can drop frames because the renderer draws too
much, because the fixed step runs too often, or because one system does too much work per
frame. These are different problems, and guessing which one you have wastes time.

The tips below are the changes that matter most in a Dacha game.

## Measure with the statistics meter

The `GameStatsMeter` system reports the frame rate and the number of actors in the scene. Add it to the
systems list like any other system. It has one option, `frequency`, which sets how often it
reports, in seconds. It defaults to `1`.

The meter dispatches `GameStatsUpdate` on the world:

```ts
import { GameStatsUpdate, type GameStatsUpdateEvent } from 'dacha/events';

const handleStats = (event: GameStatsUpdateEvent): void => {
  console.log(event.fps, event.actorsCount);
};

world.addEventListener(GameStatsUpdate, handleStats);
```

`fps` is the average over the last reporting window, not the value for the last frame.
`actorsCount` counts every actor in the current scene, including children. A [game UI
overlay](/systems/game-ui/) is a good place to show both numbers while you work.

## Know which clock your work runs on

`update` runs once per rendered frame. `fixedUpdate` runs at a fixed rate, and it can run
several times in one frame when the frame rate drops. The same code costs more in
`fixedUpdate`, because the loop repeats the step to catch up.

Keep movement, physics and anything that must be deterministic in `fixedUpdate`. Put
everything else in `update`. See [the game loop](/concepts/game-loop/).

## Lower the fixed update rate

`fixedUpdateRate` defaults to 50 Hz. Lowering it to 30 Hz removes 40% of the simulation
work. The cost is that positions change less often, which shows as jitter.

Add the `Interpolation` component to the actors that move, and the renderer smooths them
between steps. Only actors with that component cost anything extra. See
[interpolation](/systems/interpolation/).

## Cap the frame rate

By default the loop runs as often as the browser offers frames. On a 144 Hz display that is
144 updates and 144 draws per second. Set `maxFPS` to `60` and the loop skips the extra
iterations.

This helps when the game renders comfortably and you want to save battery on laptops and
phones. It does not make a slow frame faster. Both settings live under `performance` in
[`globalOptions`](/concepts/game-loop/#settings).

## Create actor queries once

Creating an `ActorQuery` walks the scene to build its initial result. After that, the query updates
itself automatically, making repeated use inexpensive.

So create a query in the system constructor and keep it:

```ts
import { SceneSystem, ActorQuery } from 'dacha';
import type { SceneSystemOptions } from 'dacha';

export default class HealSystem extends SceneSystem {
  private query: ActorQuery;

  constructor(options: SceneSystemOptions) {
    super();
    this.query = new ActorQuery({ scene: options.scene, filter: [Health] });
  }
}
```

## Use one system instead of many behaviors

A behavior is an object per actor. The behavior system creates one instance for every actor
that uses it, and calls its `update` once per actor per frame. That is what you want for
logic that differs between actors.

When hundreds of actors run the same logic, a system does the same work in one loop over one
query, and it holds its state once instead of once per actor.

## Give colliders layers

The physics system first finds the colliders whose bounding boxes overlap, then tests their
exact shapes. The [collision matrix](/systems/physics/collisions/#collision-layers) is applied
between those two steps. A pair on layers that cannot collide never reaches the shape test.

So put bullets, pickups and scenery on their own layers and switch off the combinations that
mean nothing in your game.

## Count the filter effects

A [filter effect](/systems/rendering/filter-effects/) applies to the whole picture, not to
one actor. Each effect you add is another pass over the screen, at the size of the canvas. Two
or three are fine. A long list is not, and it costs the same whether the scene is busy or
almost empty.

## Split the game into scenes

The renderer loads the images a scene needs when the scene loads, and releases them when the
scene is destroyed. Smaller scenes therefore hold less in memory. A single scene that holds
every level holds every image at once.

Two details are worth knowing. Images used by [templates](/editor/templates/) load with every
scene, because any scene can spawn any template. And `autoDestroy: false` keeps the scene you
left in memory, with its images. That is the price of returning to it without rebuilding it.
See [scenes and the world](/concepts/scenes-and-world/).

## Do not create objects every frame

Code in `update` or `fixedUpdate` runs 50 or more times a second. Every object it creates
becomes garbage a moment later. The garbage collector then runs during play, and that shows as
an uneven frame rate.

Reuse vectors and arrays instead of building new ones each step, and keep lookup tables
outside the loop.

## Draw calls and textures

Everything above is the engine's side. The rendering side belongs to pixi.js, which Dacha uses
to draw. Its [performance tips](https://pixijs.com/8.x/guides/concepts/performance-tips) cover
texture atlases, batching and what breaks a batch.
