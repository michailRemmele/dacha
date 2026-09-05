---
title: "Systems: World vs Scene"
description: "The two kinds of system, and the single question that decides between them."
---

Logic lives in systems. There are two kinds, and choosing between them comes down to one
question:

**Does this need to survive a scene change?**

If yes, it is a world system. If no, it is a scene system.

## World systems

A `WorldSystem` is created once and lives for the whole run. Rendering, input and audio are
world systems: a renderer that was destroyed and rebuilt on every scene change would throw
away its GPU state, and audio would cut out between levels.

World systems get three lifecycle hooks the other kind does not have:

| Hook | When |
| --- | --- |
| `onWorldLoad` | Once, as the world is being set up |
| `onWorldReady` | Once, after every world system has loaded |
| `onWorldDestroy` | Once, as the game shuts down |

The split between load and ready exists so a system can depend on another being ready
without depending on construction order.

## Scene systems

A `SceneSystem` is created when its scene loads and destroyed when the scene unloads.
Level logic, enemy AI, a score counter for one level: anything whose lifetime matches a
scene's.

Because they are rebuilt per scene, scene systems start with clean state every time a
scene loads. That is usually what you want, and it is worth remembering when something
mysteriously resets.

## The hooks both kinds share

| Hook | When | Notes |
| --- | --- | --- |
| `onSceneLoad` | Before the scene becomes active | Async. Load resources here. |
| `onSceneEnter` | Once the scene is active | |
| `fixedUpdate` | At a fixed rate | May run zero or several times per frame |
| `update` | Once per rendered frame | Variable delta |
| `onSceneExit` | As the scene stops being active | |
| `onSceneDestroy` | As the scene is torn down | Remove listeners here. |

A world system receives the scene hooks too, once per scene change, which is how a
persistent system reacts to the world moving between levels.

`onSceneLoad` is the only async hook. The engine waits for it, so it is the correct place
to fetch anything the scene cannot start without.

## What a system receives

Both kinds are constructed with an options object. The shared fields are:

| Field | What it is |
| --- | --- |
| `actorSpawner` | Creates actors from templates at runtime |
| `templateCollection` | The templates defined in the configuration |
| `globalOptions` | The global settings for the game |
| `time` | Shared timing state |
| `resources` | Whatever was passed for this system in the engine's `resources` |

A scene system additionally receives `scene` and `world`. A world system receives `world`.

## Choosing between `update` and `fixedUpdate`

Put simulation in `fixedUpdate`: movement, physics, anything where a different frame rate
must not change the outcome. Put presentation in `update`: anything that should track the
display.

Getting this backwards produces a game that plays differently on different monitors, which
is a bug that will not reproduce on your machine. See
[the game loop](/concepts/game-loop/).

## Cleaning up

A system that registers event listeners in its constructor must remove them in
`onSceneDestroy`. Nothing does it for you, and a scene system is constructed again on the
next scene load, so the leak compounds every time the player restarts a level.

The same applies to an `ActorQuery`, which subscribes to the scene to keep itself current
and has a `destroy()` method for the purpose.

Next: [writing a system](/writing-game-code/systems/).
