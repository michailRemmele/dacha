# AGENTS.md — dacha monorepo

## What this is

One repository holding two npm packages:

- **[packages/dacha/](packages/dacha/)** — **dacha**, a JavaScript/TypeScript game engine
  for browser games, published as `dacha`. Rendering is built on **pixi.js 8**. The engine
  is data-driven: a game is described by a JSON-like `Config` (scenes, actors, templates,
  systems, global options) which the engine bootstraps into a running world.
- **[packages/dacha-workbench/](packages/dacha-workbench/)** — **dacha-workbench**, the
  GUI editor for that engine, published as `dacha-workbench`. An **Electron + React 18**
  desktop app with a `dacha-workbench` CLI bin. It depends on `dacha`.

The editor ships in two forms: **an app** (the Electron editor a game developer runs
against their project) and **a library** (the ESM exports `dacha-workbench` and
`dacha-workbench/decorators`, which game projects import to describe their custom
components and systems to the editor).

The two packages were separate repositories until 2026-08-16 and are now one, with both
histories preserved. Versions are **lockstep** — `scripts/release.js` gives both packages
and the editor's `dacha` devDependency the same version. They differ only until the first
release from the monorepo.

## Commands

All day-to-day commands run from the **repository root**:

```bash
npm run build        # tsc -b (both packages) + webpack app build for the editor
npm run clean        # remove all build output and incremental state
npm test             # tsc -b (via pretest), then Jest in both packages
npm run lint         # eslint across the whole repo — there is no package-level lint
npm run dev          # tsc -b --watch + the editor's dev server, together
npm run pack:local   # build and produce installable .tgz archives in packs/
npm run release <v>  # preflight, lockstep version bump, publish, tag, push
```

Run a single test file with `npx jest path/to/file.test.ts` from inside the relevant
package. `npm run dev` is how you see an engine change end-to-end: the TypeScript watcher
recompiles the engine and the editor's webpack picks it up without a manual build.

**Typecheck with `tsc -b` from the root.** Jest (ts-jest, per-file transpile) and eslint
do **not** do a strict whole-project typecheck, so real type errors pass both. If output
looks stale or missing, run `npm run clean` or `tsc -b --force` — `tsc -b` honours
incremental state and will legitimately do nothing when it believes it is up to date.

## Repository layout

```
packages/dacha/              the engine
packages/dacha-workbench/    the editor
scripts/                     pack-local.js, release.js (plain Node CommonJS, unlinted)
docs/                        local planning material — GITIGNORED, never committed
packs/                       output of pack:local — gitignored
```

Tooling lives once, at the root: `package.json` (npm workspaces), `tsconfig.json`
(solution file with project references), `eslint.config.mjs`, `.prettierrc`, `.husky/`,
`.vscode/`. Do not reintroduce per-package copies of any of these.

TypeScript project references link the two packages: the editor's
`tsconfig.esm.json` references the engine's, and `tsc -b` builds them in order.

### tsconfig settings that look removable and are not

These were each established empirically; removing any of them breaks the build in a way
tests do not catch:

- `packages/dacha/tsconfig.esm.json` → `"types": ["jest"]`. Not `node` (clashes with
  `lib.dom` over `TextEncoder`/`TextDecoder`), not empty (test helpers outside the
  `**/*.test.ts` mask compile into the published package and call bare `expect`).
- Both `tsconfig.esm.json` files → `"rootDir": "./src"`. Without it `composite` emits to
  `build/src/…` and every declared entry point in `package.json` breaks.
- `packages/dacha-workbench/tsconfig.esm.json` → explicit `include` with `src/**/*.json`,
  because `app.tsx` imports `view/locales/en.json` and the default include does not match
  `.json`.
- Both packages' `build:clean` → must delete `tsconfig.esm.tsbuildinfo`. It lives beside
  the package manifest, not in the output directory, so a clean that misses it leaves tsc
  believing the project is up to date; since `build` is also `prepublishOnly`, that would
  publish an empty tarball.

---

# The engine — packages/dacha

## Architecture

An **ECS-flavored** design:

- **Component** — plain data attached to an actor (position, sprite, collider, …). Every
  component class has a static `componentName`. Core in
  [packages/dacha/src/engine/component/](packages/dacha/src/engine/component/), built-ins
  in [packages/dacha/src/contrib/components/](packages/dacha/src/contrib/components/).
- **Actor** — the main entity
  ([src/engine/actor/actor.ts](packages/dacha/src/engine/actor/actor.ts)). Holds
  components, supports parent/child hierarchy, always created with a `Transform`. Actors
  can be instantiated from **templates**.
- **System** — the logic units
  ([src/engine/system/system.ts](packages/dacha/src/engine/system/system.ts)). Every
  system class has a static `systemName`. Two kinds:
  - `WorldSystem` — global, persists across scene changes (rendering, input, audio). Extra
    lifecycle: `onWorldLoad`, `onWorldReady`, `onWorldDestroy`.
  - `SceneSystem` — created and destroyed with a scene (game logic, AI).
  - Shared hooks: `onSceneLoad` (async, load resources), `onSceneEnter`, `onSceneExit`,
    `onSceneDestroy`, `update` (variable timestep), `fixedUpdate` (fixed timestep).
- **Scene** — a level/menu/state, a container of actors
  ([src/engine/scene/scene.ts](packages/dacha/src/engine/scene/scene.ts)).
- **World** — root container of all scenes, exposes the `systemApi` registry
  ([src/engine/world/](packages/dacha/src/engine/world/)).
- **Entity** — shared base ([src/engine/entity/](packages/dacha/src/engine/entity/))
  providing the hierarchy and event-target behaviour Actor/Scene/World build on.
- **Engine** — [src/engine/engine.ts](packages/dacha/src/engine/engine.ts). Constructed
  with `{ config, systems, components, assets, resources? }`. Lifecycle `play()` /
  `pause()` / `stop()`; `play()` requires `config.startSceneId` and validates that every
  component and system has its static name.

**Game loop** — [src/engine/game-loop.ts](packages/dacha/src/engine/game-loop.ts): a
fixed-timestep loop via `requestAnimationFrame`, with variable-rate `update()` and
fixed-rate `fixedUpdate()`. Defaults in
[src/engine/consts.ts](packages/dacha/src/engine/consts.ts): `fixedUpdateRate` 50 Hz,
`maxFPS` uncapped, `maxFrameDelta` 250 ms, `maxFixedUpdatesPerFrame` 5. Tunable per game
via `PerformanceSettings` in `globalOptions`.

**Querying actors** — systems find actors via `ActorQuery` / `ActorCollection`
([src/engine/actor/](packages/dacha/src/engine/actor/)), filtered by components, e.g.
`new ActorQuery({ scene, filter: [Transform, Velocity] })`.

**Events** — actors, scenes and the world are event targets. Events are queued and
dispatched through a shared `eventQueue`
([src/engine/event-target/](packages/dacha/src/engine/event-target/)); there is also
`dispatchEventImmediately` for synchronous delivery. Type maps (`WorldEventMap`,
`SceneEventMap`, `ActorEventMap`) live in
[src/types/events](packages/dacha/src/types/events).

## Layout

- **src/engine/** — the framework-agnostic core (actor, component, system, scene, world,
  entity, template, asset, game-loop, math-lib, data-lib, resource-loader, time).
- **src/contrib/** — batteries-included pieces built on the core:
  - `systems/`: `renderer` (pixi.js), `physics-system`, `animator`, `audio-system`,
    `behavior-system`, `camera-system`, `character-controller`, `interpolator`,
    `keyboard-input-system` / `keyboard-control-system`, `mouse-input-system` /
    `mouse-control-system`, `game-stats-meter`, `ui-bridge`.
  - `components/`: `transform`, `sprite`, `bitmap-text`, `mesh`, `pixi-view`, `camera`,
    `collider`, `rigid-body`, `character-body`, `shape`, `animatable`, `audio-source`,
    `behaviors`, `interpolation`, `keyboard-control`, `mouse-control`.
  - `assets/`: built-in asset kinds (`texture`, `audio`, `bitmapFont`).
- **src/events/**, **src/types/** — shared engine events and types.
- **src/index.ts** — the public API barrel. Subpath exports exist for `dacha/events`,
  `dacha/renderer`, `dacha/physics` (see `exports` in its `package.json`).

## Conventions

- **TypeScript strict**, `module: ESNext`, `moduleResolution: Bundler`. ESM output only —
  the package has no `"type": "module"`, so it is consumed by bundlers, not by Node
  directly.
- Public classes and methods carry **TSDoc** with `@category` for typedoc grouping; match
  that style when adding public API.
- Tests are colocated in `tests/` folders beside the code they cover.
- A component or system is unusable without its static `componentName`/`systemName` — the
  engine throws at `play()`.
- `npm run docs` regenerates the typedoc output into `packages/dacha/docs/` (gitignored).

---

# The editor — packages/dacha-workbench

## Two processes — keep them straight

This is an Electron app, so code crosses process boundaries. **When editing, know which
side you are on:**

- **Main process (Node)** — [index.js](packages/dacha-workbench/index.js) is the Electron
  entry: creates the `BrowserWindow`, runs an Express server for the renderer and project
  assets, wires IPC. Supporting modules live in
  **[electron/](packages/dacha-workbench/electron/)**: file system access, menus, native
  dialogs, project config load and watch, persistent storage, and
  **electron/script-templates/** — the scaffolding used to generate new
  components/systems/behaviors/shaders/filter-effects in the user's project. IPC message
  names are centralised in
  [electron/messages.js](packages/dacha-workbench/electron/messages.js).
- **Renderer process (React)** — everything under
  **[src/](packages/dacha-workbench/src/)**, entry
  [src/app.tsx](packages/dacha-workbench/src/app.tsx).
- **CLI** — [bin/index.js](packages/dacha-workbench/bin/index.js) (commander):
  `dacha-workbench init` scaffolds a project, the default command launches the editor. In
  dev it spawns the `electron` CLI, in prod the packaged binary. `postinstall` runs
  `bin/install.js`, which packages the Electron app — set `DACHA_SKIP_APP_BUILD=1` to skip
  that when only the library part matters.

`npm start -w dacha-workbench` runs the editor against the sample project in
[fixture/](packages/dacha-workbench/fixture/); prefer the root `npm run dev`, which also
watches the engine.

## Renderer architecture (src/)

- **app.tsx** — bootstraps React, i18next (locales in `src/view/locales/`),
  `reflect-metadata`, antd reset CSS, and mounts `<App/>` inside a deep stack of context
  providers (theme, command, command-scope, hotkeys, engine, entity-explorer,
  notification, needs-reload).
- **Store / command pattern** — `src/store/`:
  - `Store` (`store.ts`) holds the project `Data` tree and notifies listeners on
    `set`/`delete` by path (`string[]`).
  - `CommanderStore` (`commander-store.ts`) wraps it with **undo/redo history** (size 100)
    and scoped commands. All mutations go through commands — `setValue`, `addValue`,
    `deleteValue` in `src/store/commands/`. **Mutate project state through commands, never
    by touching `Store` directly**, or undo/redo and effects break.
- **View** — `src/view/`: `modules/` holds the major panels (`explorer`, `inspector`,
  `toolbar`, `bottom-bar`, `settings-modal`); `providers/` the React contexts; `hooks/`
  (`useExtension`, `useConfig`, `useCommander`, `useStore`, `useBehaviors`); plus
  `components/`, `themes/`, `locales/`, `common-styles/`, `commands/`. Styling via
  **@emotion** (`*.style.ts`) and **antd**, drag and drop via **@dnd-kit**.
- **Decorators** — `src/decorators/`: the library-facing API a game project uses to
  register its engine extensions with the editor — `DefineComponent`, `DefineSystem`,
  `DefineBehavior`, `DefineAsset`, `DefineField`, `DefineShader`, `DefineFilterEffect`.
  They use `reflect-metadata` to attach names and schemas and register widgets in
  `schemaRegistry` / `class-registry`, gated by `isEditor()`. Exported via the
  `dacha-workbench/decorators` subpath.
- **Engine integration** — `src/engine/`: builds the dacha `Config` the editor runs
  (`config.ts` → `getEditorConfig`), plus editor-only components and systems layered on
  the real engine for the editing surface (pointer/hand/zoom/template tools, selection).
- **Public API** — `src/index.ts` re-exports the inspector field widgets (`Field`,
  `TextInput`, `NumberInput`, `Select`, `ColorInput`, `FileInput`, …), the `commands`
  object, hooks, `defineWidget`, providers and widget-schema types.

## Conventions

- **Renderer (`src/`)**: TypeScript strict, React function components, emotion + antd,
  i18n via `react-i18next` — never hardcode user-facing strings, add them to
  `src/view/locales/`.
- **Main and CLI (`electron/`, `bin/`)**: plain Node CommonJS, no TypeScript. Excluded
  from linting, like `scripts/` at the root.
- **Tests** colocated in `tests/` folders; jsdom environment, Testing Library, and a
  `FixJSDOMEnvironment.js` shim.
- Two build toolchains: **webpack** for the runnable app, **tsc** (`tsconfig.esm.json`)
  for the `esm/` library export. `webpack.extension.config.js` builds the project's own
  code as an extension bundle, and it externalises `dacha-workbench*` to
  `window.DachaWorkbench` so registries stay single instances.
- Keep the **main/renderer boundary** clean — the renderer reaches native capabilities
  only through IPC messages defined in `electron/messages.js`.

---

## Working agreements

- Do **not** auto-commit. Implement and verify, then let the user review and commit —
  including merges, tags and pushes. This holds for every task, plan-driven or not.
- Do not publish. `npm run release` is the user's command to run.
- `docs/` is gitignored local planning material (specs, plans, execution ledgers). Read it
  for context, but nothing there is part of the repository.
