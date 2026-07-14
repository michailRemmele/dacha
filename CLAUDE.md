# CLAUDE.md — dacha

## What this is

**dacha** is a JavaScript/TypeScript game engine for building games that run in the
browser. It is published to npm as `dacha` (currently v0.18.1), consumed both by games
and by the companion editor **dacha-workbench** (in the sibling directory). Rendering is
built on **pixi.js 8**.

The engine is data-driven: a game is described by a JSON-like `Config` (scenes, actors,
templates, systems, global options), and the engine bootstraps that config into a running
world.

## Commands

```bash
npm run build        # clean + compile ESM to build/ via tsc (tsconfig.esm.json)
npm test             # run Jest (ts-jest) — tests live in **/tests/ dirs next to source
npm run lint         # ESLint (flat config, eslint.config.mjs)
npm run docs         # generate API docs via typedoc
```

Run a single test file with `npx jest path/to/file.test.ts`.
There is no watch/dev server here — the engine is a library. To see changes end-to-end,
build it and exercise it through a game or through dacha-workbench.

## Architecture

The engine follows an **ECS-flavored** design. Terminology:

- **Component** — plain data attached to an actor (position, sprite, collider, …).
  Every component class has a static `componentName`. Defined in
  [src/engine/component/](src/engine/component/); built-in components in
  [src/contrib/components/](src/contrib/components/).
- **Actor** — the main entity ([src/engine/actor/actor.ts](src/engine/actor/actor.ts)).
  Holds components, supports parent/child hierarchy. Every actor is created with a
  `Transform` component by default. Actors can be instantiated from **templates**.
- **System** — the logic units ([src/engine/system/system.ts](src/engine/system/system.ts)).
  Every system class has a static `systemName`. Two kinds:
  - `WorldSystem` — global, persists across scene changes (rendering, input, audio).
    Extra lifecycle: `onWorldLoad`, `onWorldReady`, `onWorldDestroy`.
  - `SceneSystem` — created/destroyed with a scene (game logic, AI).
  - Shared lifecycle hooks: `onSceneLoad` (async, load resources), `onSceneEnter`,
    `onSceneExit`, `onSceneDestroy`, `update` (variable timestep), `fixedUpdate`
    (fixed timestep, for physics).
- **Scene** — a level/menu/state; a container of actors
  ([src/engine/scene/scene.ts](src/engine/scene/scene.ts)). Extends `Entity`.
- **World** — root container of all scenes; exposes `systemApi` registry
  ([src/engine/world/](src/engine/world/)). Extends `Entity`.
- **Entity** — shared base ([src/engine/entity/](src/engine/entity/)) providing the
  hierarchy + event-target behavior that Actor/Scene/World build on.
- **Engine** — [src/engine/engine.ts](src/engine/engine.ts). Constructed with
  `{ config, systems, components, resources? }`. Lifecycle: `play()` / `pause()` /
  `stop()`. `play()` bootstraps the world and starts the game loop; requires
  `config.startSceneId`. It validates that every component/system has its static name.

### Game loop

[src/engine/game-loop.ts](src/engine/game-loop.ts) implements a fixed-timestep loop via
`requestAnimationFrame`, with variable-rate `update()` and fixed-rate `fixedUpdate()`.
Defaults in [src/engine/consts.ts](src/engine/consts.ts): `fixedUpdateRate` 50 Hz,
`maxFPS` uncapped, `maxFrameDelta` 250 ms, `maxFixedUpdatesPerFrame` 5. Tunable per-game
via `PerformanceSettings` in the config's `globalOptions`.

### Querying actors

Systems find actors to operate on via `ActorQuery` / `ActorCollection`
([src/engine/actor/](src/engine/actor/)), filtered by which components an actor has, e.g.
`new ActorQuery({ scene, filter: [Transform, Velocity] })`.

### Events

Actors/scenes/world are event targets. Events are queued and dispatched through a shared
`eventQueue` ([src/engine/event-target/](src/engine/event-target/)); there is also a
`dispatchEventImmediately` for synchronous delivery. Event type maps
(`WorldEventMap`, `SceneEventMap`, `ActorEventMap`) live in
[src/types/events](src/types/events) and give type-safe payloads.

## Layout

- **[src/engine/](src/engine/)** — the framework-agnostic core (actor, component, system,
  scene, world, entity, template, game-loop, math-lib, data-lib, resource-loader, time).
- **[src/contrib/](src/contrib/)** — batteries-included pieces built on the core:
  - `systems/`: `renderer` (pixi.js), `physics-system`, `animator`, `audio-system`,
    `behavior-system`, `camera-system`, `character-controller`, `interpolator`,
    `keyboard-input-system` / `keyboard-control-system`,
    `mouse-input-system` / `mouse-control-system`, `game-stats-meter`, `ui-bridge`.
  - `components/`: `transform`, `sprite`, `bitmap-text`, `mesh`, `pixi-view`, `camera`,
    `collider`, `rigid-body`, `character-body`, `shape`, `animatable`, `audio-source`,
    `behaviors`, `interpolation`, `keyboard-control`, `mouse-control`.
- **[src/events/](src/events/)**, **[src/types/](src/types/)** — shared engine events and
  types. `src/types/` is also a `typeRoot` (see tsconfig).
- **[src/index.ts](src/index.ts)** — the public API barrel (what npm consumers import).
  Subpath exports exist for `dacha/events`, `dacha/renderer`, `dacha/physics` (see
  `exports` in package.json).

## Conventions

- **TypeScript strict mode**, `module: ESNext`, `moduleResolution: Bundler`. Output is
  ESM only.
- Public classes/methods are documented with **TSDoc** including `@category` (Core, etc.)
  for typedoc grouping — match this style when adding public API.
- Tests are colocated in `tests/` folders beside the code they cover.
- A component/system is only usable if its static `componentName`/`systemName` is set —
  the engine throws at `play()` otherwise.
- Physics design docs for recent/ongoing work live at the workspace root
  (`../physics-feature-*.md`, `../physics-stabilization-ranking.md`).

## Working agreements

- Do **not** auto-commit while executing a plan — implement and verify, then let the user
  review and commit. (This is not a git repo at the workspace root; each project has its
  own GitHub remote.)
