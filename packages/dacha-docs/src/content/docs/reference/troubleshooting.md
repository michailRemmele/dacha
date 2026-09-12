---
title: "Troubleshooting"
description: "The engine's error messages, what causes each one, and where to look first."
---

The engine reports its problems in the browser console. This page is the lookup table: find
the message you saw, and the line beside it says what to change.

## Errors worth recognising

| What you see | What it means |
| --- | --- |
| `Can't start the engine without starting scene.` | `Start Scene` in the editor's Project settings is empty |
| `Missing componentName field for … component.` | A class reached the engine without its static name |
| `System not found: …` | The name is in the configuration, the class never reached the engine |
| `Behavior not found: …` | The same, for a behavior. The actor keeps running without it |
| `Component not found: …` | The same, for a component. The actor is built without it |
| `Error while loading scene. Not found scene with id: …` | `LoadScene` was given an id that no longer exists |
| `Can't find template with the following id: …` | `spawn` was given an id that no longer exists |
| `Can't find asset with the following id: …` | A component points at an asset that was deleted |

The first two are startup failures, and the tab shows them as soon as it reloads. The rest
wait until the code that needs the missing thing runs.

## The quiet ones

A missing system, behavior or component does not stop the game. The engine drops it, writes
one line to the console, and carries on. Nothing on screen says what happened. The only
symptom is that something stopped happening, so read the console before you read the code.

A dropped component is the one to watch. The actor is still there, still drawn, still moving,
but the data other code reads from it is gone.

All three mean the same thing. The configuration names a class that never reached
`new Engine(…)`. See [when the class never
arrives](/game-code/auto-registration/#when-the-class-never-arrives).

## Where to look, in order

1. **The browser console.** Every message above lands there, and most of them name the thing
   that is missing.
2. **The editor.** Did it write the file? Nothing reaches the game until it does. Save again
   and watch the tab reload.
3. **The entry point.** If the configuration names a class, make sure the class reaches
   `new Engine(…)`, either by an import or by a glob. [The editor writes names, not
   classes](/editor/systems-and-options/#the-editor-writes-names-not-classes), so a system
   you added in its Systems tab is not enough on its own.
