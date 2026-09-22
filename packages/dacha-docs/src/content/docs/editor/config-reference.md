---
title: "Editor configuration"
description: "Every key the editor configuration file accepts."
---

The editor reads one CommonJS file from your project, `dacha-workbench.config.cjs`, in the
directory you start it from. Pass `--config <path>` to use a different file. Every path in the
file is relative to that directory.

This is the [starter project](/getting-started/installation/)'s file:

```js
module.exports = {
  projectConfig: 'data/data.json',
  assetsRoot: 'data/assets',
  autoSave: true,
};
```

## Paths

| Key | Default | What it does |
| --- | --- | --- |
| `projectConfig` | required | The game configuration file the editor reads and writes |
| `assetsRoot` | required | The directory the editor serves assets from, and the root of the file pickers in the inspector |
| `contextRoot` | `'./src'` | The directory the editor scans for your classes |

## Which files the editor compiles

The editor imports every file under `contextRoot` that matches these patterns. Each key takes
an array of regular expressions.

| Key | Default |
| --- | --- |
| `components` | `[/\.component\.ts$/]` |
| `systems` | `[/\.system\.ts$/]` |
| `assets` | `[/\.asset\.ts$/]` |
| `behaviors` | `[/\.behavior\.ts$/, /\.filter-effect\.ts$/, /\.shader\.ts$/]` |
| `widgets` | `[/\.widget\.(ts\|js\|tsx\|jsx)$/]` |

Your array replaces the default. It does not add to it.

Your game collects its files separately, with the globs in its entry point. Keep the two lists
in sync. [How scripts are found](/game-code/auto-registration/) explains why.

## What the editor imports

| Key | Default | What it does |
| --- | --- | --- |
| `events` | `'./src/events/index.ts'` | A module whose exported strings become the event names the inspector offers. See [Telling the editor about your events](/concepts/events/#telling-the-editor-about-your-events) |
| `locales` | `'./src/locales/index.ts'` | Translations for the labels your own components show in the inspector |
| `libraries` | `[]` | Packages the editor imports alongside your code |

`events` and `locales` are optional. The editor skips a path that does not exist.

For a package in `libraries`, the editor also imports its `widgets`, `events` and `locales`
subpaths if the package exports them. A shared set of components can bring its own inspector
widgets with it.

## The inspector

| Key | Default | What it does |
| --- | --- | --- |
| `formatWidgetNames` | `true` | Rewrite class names for display: `MyCustomComponent` becomes `My Custom Component` |

## Saving

| Key | Default | What it does |
| --- | --- | --- |
| `autoSave` | off | Save the project on a timer |
| `autoSaveInterval` | `10` | Seconds between saves |

## Script templates

| Key | What it generates |
| --- | --- |
| `templates.component` | A component |
| `templates.system` | A system |
| `templates.behavior` | A behavior |
| `templates.shader` | A shader |
| `templates.filterEffect` | A filter effect |

Each is a function that takes the class name and returns the text of the file. See
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
