# AGENTS.md — dacha-workbench

## What this is

**dacha-workbench** is the GUI editor for the **dacha** game engine (the sibling `dacha/`
directory). It is an **Electron + React 18** desktop app, distributed on npm as
`dacha-workbench` with a `dacha-workbench` CLI bin. It depends on
`dacha`.

It ships in two forms:

1. **An app** — the Electron editor a game developer runs against their project.
2. **A library** — an ESM export (`dacha-workbench` and `dacha-workbench/decorators`)
   that game projects import to describe their custom components/systems to the editor
   (widgets, schemas, decorators).

## Commands

```bash
npm start            # dev: launches Electron against fixture/ project (NODE_ENV=development)
npm run build        # clean + webpack app build (build:app) + tsc ESM lib (build:esm)
npm test             # Jest + jsdom + Testing Library
npm run lint         # ESLint (flat config, eslint.config.mjs)
```

`npm start` runs `bin/index.js --config fixture/dacha-workbench.config.js`, which spawns
Electron against the sample project in [fixture/](fixture/). Use this to see changes
end-to-end. In dev the renderer is served by `webpack-dev-middleware` (live rebuild);
in production the app serves the prebuilt `build/`.

## Two processes — keep them straight

This is an Electron app, so code splits across process boundaries. **When editing, know
which side you're on:**

- **Main process (Node)** — [index.js](index.js) (root) is the Electron entry. It creates
  the `BrowserWindow`, runs an Express server to serve the renderer + project assets, and
  wires IPC. Supporting main-process modules live in **[electron/](electron/)**:
  file system access, menus, native dialogs (`get-assets-dialog`,
  `get-path-selection-dialog`), project config load + watch, persistent storage, and
  **[electron/script-templates/](electron/script-templates/)** — the templates + scaffolding
  used to generate new components/systems/behaviors/shaders/filter-effects in the user's
  project (e.g. `get-shader-template.js`, `create-component.js`). IPC message names are
  centralized in [electron/messages.js](electron/messages.js).
- **Renderer process (React)** — everything under **[src/](src/)**. Entry is
  [src/app.tsx](src/app.tsx). Plain JS/CommonJS in `electron/` and `bin/`; TypeScript +
  React in `src/`.
- **CLI** — [bin/index.js](bin/index.js) (commander): `dacha-workbench init` scaffolds a
  project; the default command launches the editor. In dev it spawns the `electron` CLI;
  in prod it spawns the packaged binary. `postinstall` runs `bin/install.js`.

## Renderer architecture (src/)

- **[src/app.tsx](src/app.tsx)** — bootstraps React, i18next (locales in
  `src/view/locales/`), `reflect-metadata`, antd reset CSS, and mounts `<App/>` wrapped in
  a deep stack of context providers (theme, command, command-scope, hotkeys, engine,
  entity-explorer, notification, needs-reload).

- **Store / command pattern** — [src/store/](src/store/):
  - `Store` ([store.ts](src/store/store.ts)) holds the project `Data` tree and notifies
    listeners on `set`/`delete` by path (`string[]`).
  - `CommanderStore` ([commander-store.ts](src/store/commander-store.ts)) wraps `Store`
    with **undo/redo history** (size 100) and scoped commands. All mutations go through
    commands — the public ones are `setValue`, `addValue`, `deleteValue` (see
    [src/store/commands/](src/store/commands/)). **Mutate project state through commands,
    not by touching `Store` directly**, so undo/redo and effects stay correct.

- **View** — [src/view/](src/view/):
  - `modules/`: the major editor panels — `explorer` (entity tree), `inspector`
    (property editing), `toolbar`, `bottom-bar`, `settings-modal`.
  - `providers/`: the React contexts listed above.
  - `hooks/`: `useExtension`, `useConfig`, `useCommander`, `useStore`, `useBehaviors`
    (also re-exported from the package root).
  - `components/`, `hooks/`, `themes/`, `locales/`, `common-styles/`, `commands/`.
  - Styling via **@emotion** (`*.style.ts`) and **antd**; drag/drop via **@dnd-kit**.

- **Decorators** — [src/decorators/](src/decorators/): the library-facing API a game
  project uses to register its engine extensions with the editor —
  `DefineComponent`, `DefineSystem`, `DefineBehavior`, `DefineField`, `DefineShader`,
  `DefineFilterEffect`. They use `reflect-metadata` to attach names/schemas and register
  widgets in `schemaRegistry` / `class-registry` (only when running inside the editor,
  gated by `isEditor()`). Exported via the `dacha-workbench/decorators` subpath.

- **Engine integration** — [src/engine/](src/engine/): builds the dacha `Config` the
  editor runs ([config.ts](src/engine/config.ts) → `getEditorConfig`), plus editor-only
  `components/` and `systems/` layered on top of the real engine for the editing surface
  (tools like pointer/hand/zoom/template, selection, etc.).

- **Public API** — [src/index.ts](src/index.ts) re-exports the inspector field widgets
  (`Field`, `TextInput`, `NumberInput`, `Select`, `ColorInput`, `FileInput`, …), the
  `commands` object, hooks, `defineWidget`, providers, and widget-schema types. This is
  what extension authors import.

## Conventions

- **Renderer (`src/`)**: TypeScript strict, React function components, emotion + antd,
  i18n via `react-i18next` (never hardcode user-facing strings — add to
  `src/view/locales/`).
- **Main/CLI (`electron/`, `bin/`)**: plain Node CommonJS (`require`), no TypeScript.
- **Tests** colocated in `tests/` folders; jsdom env + Testing Library; there's a
  `FixJSDOMEnvironment.js` shim.
- Two build toolchains: **webpack** for the runnable app, **tsc** (`tsconfig.esm.json`)
  for the `esm/` library export. There's also `webpack.extension.config.js` for the
  extension bundle.
- Keep the **main/renderer boundary** clean — the renderer reaches native capabilities
  only through IPC messages defined in `electron/messages.js`.

## Working agreements

- Do **not** auto-commit while executing a plan — implement and verify, then let the user
  review and commit. (This project has its own GitHub remote,
  `github.com/michailRemmele/dacha-workbench`; the workspace root is not a git repo.)
