---
title: "Data-driven configuration"
description: "The configuration tree the engine consumes, key by key."
---

Everything the engine needs to build a world lives in one JSON-shaped configuration.
By default it is `data/data.json`, and it is the file the editor reads and writes.

```json
{
  "scenes": [],
  "systems": [],
  "templates": [],
  "globalOptions": [],
  "startSceneId": null
}
```

## `scenes`

The levels, menus and other game states. Each scene holds the actors in it, and the
systems that are scoped to it.

Only one scene is loaded at a time. See [scenes and the world](/concepts/scenes-and-world/).

## `startSceneId`

The scene the engine opens with. `play()` refuses to start when this is unset, which is
the most common error on a brand new project.

## `templates`

Reusable actor blueprints. A template describes an actor and its components once, and a
scene can then contain many instances of it.

Instantiating from a template is not the same as copying an actor. Instances keep their
link to the template, so editing the template updates every instance. That indirection is
the entire reason to use one. See the
[templates workflow](/editor/templates/).

## `systems`

Which systems run, in what order, and the options each one receives.

Order matters: systems execute in the order listed, so a system that reads what another
one wrote has to come after it. The engine does not reorder them for you.

The entries name systems as strings. The classes themselves are passed to the `Engine`
constructor in your code, and the engine matches the two up at startup, throwing if a
named system was never supplied.

## `globalOptions`

Settings that apply to the whole game. Note that it is a **list of named entries**, not a
map:

```json
"globalOptions": [
  {
    "name": "sorting",
    "options": {
      "order": "bottomRight",
      "layers": [{ "id": "…", "name": "default" }]
    }
  },
  {
    "name": "performance",
    "options": { "maxFPS": 0, "fixedUpdateRate": 50 }
  }
]
```

`sorting` controls draw order and the layers actors can be assigned to. `performance`
tunes the game loop; see [the game loop](/concepts/game-loop/) for what each value does.

A fresh project starts with exactly these two, created by
`dacha-workbench init`.

## Hand-editing

The format is plain JSON and nothing stops you editing it. In practice you rarely want to:
identifiers are generated, the editor rewrites the file on save, and a malformed entry
usually surfaces as a runtime error rather than a parse error.

Reading it is a different matter and is worth doing. Opening the file after making a
change in the editor is the fastest way to understand what the editor actually does.
