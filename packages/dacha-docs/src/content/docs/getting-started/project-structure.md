---
title: "Project structure"
description: "What lives where in a dacha project, and which conventions are load-bearing."
---

A dacha project separates the data the engine consumes from the TypeScript that extends
it. Most of the layout is a suggestion. One part of it, the file-name suffixes, is relied
on by tooling and is not.

## After `init`

```
data/
  assets/
  data.json
dacha-workbench.config.js
package.json
```

That is the minimum the editor needs: somewhere to read and write the configuration, and
somewhere to keep assets.

## What a project grows into

```
data/
  data.json                    the configuration the engine consumes
  assets/                      textures, audio, fonts
src/
  index.ts                     builds the Engine and calls play()
  game/
    components/
      health/health.component.ts
    systems/
      combat/combat.system.ts
    behaviors/
      camera/camera.behavior.ts
    events/index.ts            project event names
  ui/                          optional, mounted through the UI bridge
dacha-workbench.config.js
webpack.config.js
```

Nothing forces the `game` and `ui` split, or the one-directory-per-class arrangement. Use
whatever grouping suits the project.

## The suffixes are not decoration

These endings are matched by a glob at build time:

| Suffix | What it declares |
| --- | --- |
| `*.component.ts` | A component |
| `*.system.ts` | A system |
| `*.behavior.ts` | A behavior |
| `*.shader.ts` | A shader |
| `*.filter-effect.ts` | A filter effect |

A file named correctly is collected into the game automatically. A file named
`health.ts` is not, and the component it defines will be missing at runtime with no build
error to warn you. The class must also be the **default export** of its file.

This is the mechanism behind generating scripts from the editor, and it is worth reading
in full on [Scripts & auto-registration](/writing-game-code/auto-registration/).

## The two configuration files

`data/data.json` is the game. It is read by the engine at runtime and written by the
editor as you work. You can edit it by hand, but you rarely want to.

`dacha-workbench.config.js` is the editor's own settings: where the configuration lives,
where assets live, which project events exist, and how autosave behaves. It is never read
by the engine. Every key is documented in the
[configuration reference](/editor/config-reference/).

## What to commit

Commit `data/`, `src/` and both configuration files. The `data/assets` directory holds
source assets your game needs at runtime, so it belongs in version control alongside the
configuration that references it.
