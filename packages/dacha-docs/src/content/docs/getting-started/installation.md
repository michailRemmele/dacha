---
title: "Installation & setup"
description: "Install the engine and the editor, scaffold a project, and launch the editor."
---

A dacha project is an ordinary npm project with two dependencies and one configuration
file. The editor's command line interface scaffolds the initial structure for you.

## Prerequisites

Node 22.12 or newer.

Your game will also need a bundler. dacha does not provide one, and the engine is
distributed as ESM without a CommonJS build, so it is consumed by a bundler rather than by
Node directly. The [project template](/resources/examples/) uses webpack, and the
[auto-registration convention](/writing-game-code/auto-registration/) assumes it.

## Install

```bash
npm init -y
npm i dacha dacha-workbench
```

`dacha` is the engine your game imports. `dacha-workbench` provides both the editor
application and the decorators your project uses to describe its classes to that editor.

Installing `dacha-workbench` runs a `postinstall` step that packages the Electron
application. If you only need the library exports, for instance in a continuous
integration job that just typechecks, skip it:

```bash
DACHA_SKIP_APP_BUILD=1 npm i dacha dacha-workbench
```

## Scaffold the project

```bash
npx dacha-workbench init
```

This creates four things:

| Path | What it is |
| --- | --- |
| `data/` | Everything the engine reads at runtime |
| `data/assets/` | Textures, audio and fonts |
| `data/data.json` | The game configuration, seeded empty |
| `dacha-workbench.config.js` | Tells the editor where to find the above |

The generated `data.json` has no scenes and no start scene yet. That is expected; you
create the first scene in the editor.

## Launch the editor

```bash
npx dacha-workbench
```

The editor looks for `dacha-workbench.config.js` in the directory you run it from. If the
file is somewhere else, point at it:

```bash
npx dacha-workbench --config ./config/workbench.config.js
```

Without a configuration file the command exits with an error naming that flag. See the
[configuration reference](/editor/config-reference/) for every key the file accepts.

:::note
`init` and the bare launch are the only commands the interface provides. There is no
separate build, upgrade or validation command.
:::

## Serving the game

The engine relies on browser APIs that are only available in a
[secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts).
Your game must be served over HTTPS or from `localhost`. Opening the built `index.html`
directly from the filesystem will not work.

## Next

- [Your first scene](/getting-started/first-scene/) builds something you can run.
- [Project structure](/getting-started/project-structure/) explains the layout and the
  conventions that go with it.
