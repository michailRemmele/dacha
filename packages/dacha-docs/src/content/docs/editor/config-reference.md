---
title: "Editor configuration"
description: "Every key the editor configuration file accepts."
---

The editor reads one file from your project. It says where the game configuration lives, where
the assets are, which of your files to compile, and how to save. This page lists every key it
accepts.

## Where the file is

The CLI looks for `dacha-workbench.config.cjs` in the directory you run it from. Point it
somewhere else with `--config`:

```bash
dacha-workbench --config config/editor.cjs
```

Without the file the editor does not start. It prints
`Cannot find configuration file.` and exits.

The editor loads the file with `require`, so the file must be CommonJS. The `.cjs` extension
says so whatever the rest of the project does, including a project with `"type": "module"` in
its `package.json`. A plain `dacha-workbench.config.js` also works, and the CLI falls back to
it when there is no `.cjs` file. This is the [starter
project](/getting-started/installation/)'s `dacha-workbench.config.cjs`:

```js
module.exports = {
  projectConfig: 'data/data.json',
  assetsRoot: 'data/assets',
  autoSave: true,
};
```

Every path in the file is relative to the directory you started the editor from.

## Paths

| Key | Default | What it does |
| --- | --- | --- |
| `projectConfig` | required | The game configuration file the editor reads and writes |
| `assetsRoot` | required | The directory the editor serves assets from, and the root of the file pickers in the inspector |
| `contextRoot` | `'./src'` | The directory the editor scans for your classes |

The editor serves `assetsRoot` over HTTP, which is how a sprite appears in the viewport: a
`src` of `images/player.png` resolves inside that directory.

## Which files the editor compiles

The editor compiles your project's classes itself and imports everything that matches these
patterns, under `contextRoot`. Each key takes an array of regular expressions.

| Key | Default |
| --- | --- |
| `components` | `[/\.component\.ts$/]` |
| `systems` | `[/\.system\.ts$/]` |
| `assets` | `[/\.asset\.ts$/]` |
| `behaviors` | `[/\.behavior\.ts$/, /\.filter-effect\.ts$/, /\.shader\.ts$/]` |
| `widgets` | `[/\.widget\.(ts\|js\|tsx\|jsx)$/]` |

Shaders and filter effects share the `behaviors` key, because the editor treats all three as
behavior-like classes. Replacing an array replaces the default rather than adding to it, so
list every pattern you want.

Your game collects its own files separately, with the globs in its entry point. Keep the two
lists in sync. [How scripts are found](/game-code/auto-registration/) explains why there are
two lists.

## What the editor imports

| Key | Default | What it does |
| --- | --- | --- |
| `events` | `'./src/events/index.ts'` | A module whose exported strings become the event names the inspector offers |
| `locales` | `'./src/locales/index.ts'` | Translations for the labels your own components show in the inspector |
| `libraries` | `[]` | Packages the editor imports alongside your code |

The `events` module is the reason a `KeyboardControl` bind offers a list to pick from instead
of a text field. The same list fills the event fields of `MouseControl` and of animation
transitions. [Telling the editor about your
events](/concepts/events/#telling-the-editor-about-your-events) covers what the module has to
export. Both files are optional: the editor checks whether the path exists and skips it if it
does not.

A package listed in `libraries` is imported so its decorated classes register, and the editor
also imports its `widgets`, `events` and `locales` subpaths when the package exports them. A
shared set of components can therefore bring its own inspector panels with it.

## The inspector

| Key | Default | What it does |
| --- | --- | --- |
| `formatWidgetNames` | `true` | Rewrite class names for display: `MyCustomComponent` becomes `My Custom Component` |

Set it to `false` to see class names exactly as they are written.

## Saving

| Key | Default | What it does |
| --- | --- | --- |
| `autoSave` | off | Save the project on a timer |
| `autoSaveInterval` | `10` | Seconds between saves |

Saving writes `projectConfig`. With autosave off, only
<kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>S</kbd> writes it. See
[saving](/editor/building-a-scene/#saving).

## Script templates

| Key | What it generates |
| --- | --- |
| `templates.component` | A component |
| `templates.system` | A system |
| `templates.behavior` | A behavior |
| `templates.shader` | A shader |
| `templates.filterEffect` | A filter effect |

Each is a function that takes the class name and returns the text of the file. Supply your own
to generate files that follow your project's conventions. See
[generating scripts](/editor/generating-scripts/).

```js
module.exports = {
  projectConfig: 'data/data.json',
  assetsRoot: 'data/assets',
  templates: {
    component: (name) => `export default class ${name} {}\n`,
  },
};
```
