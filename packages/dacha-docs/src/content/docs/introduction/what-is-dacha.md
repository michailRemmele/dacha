---
title: "What is dacha"
description: "An overview of the dacha game engine, what it does, and who it is for."
---

dacha is a game engine for 2D browser games. It ships as two npm packages: `dacha`, the
engine itself, and `dacha-workbench`, a desktop editor built for it. Rendering runs on
[pixi.js](https://pixijs.com/).

The engine is **data-driven**. A game is not assembled by calling constructors in a
startup script; it is described by a configuration of scenes, actors, templates and
systems, which the engine reads and turns into a running world. The editor is a visual
front end for that same configuration.

## What you get

- **A configuration format** describing every scene, the actors in them, the templates
  they are instantiated from, the systems that run, and the options that tune the game.
- **A desktop editor** that reads and writes that configuration, so scenes are assembled
  by dragging actors around rather than by editing JSON.
- **Script generation with automatic pickup.** Create a component, system or behavior from
  the editor's interface and it becomes available in the inspector and in the running game
  without being imported or registered anywhere by hand.
- **Built-in systems** for rendering, physics, character movement, interpolation,
  animation, audio, keyboard and mouse input, cameras, and mounting a user interface.

## The workflow

You lay out a scene in the editor and press play to see it run, because the editor hosts
the real engine rather than a preview of it. When the scene needs behaviour that does not
exist yet, you generate a component or a system from the same interface. The editor writes
a file into your project, and from that moment the class is visible to both sides: your
game constructs it, and the editor offers it in the inspector with its fields laid out.

Nothing in that loop requires you to register the new class, import it into a barrel file,
or restart a build pipeline by hand. That round trip is the part of dacha most worth
understanding, and it has [its own page](/writing-game-code/auto-registration/).

## Where it fits

dacha suits 2D browser games where you want a visual scene editor without adopting a large
engine, and where the game logic is comfortable in TypeScript. It has been used to build
[games for game jams](/resources/examples/), which is the workload it is shaped around:
small teams, short timelines, and a browser as the target.

## When not to use it

Being straightforward about the limits saves you time:

- **It is before version 1.0.** Breaking changes land between minor versions. There are
  [migration notes](/reference/migration/), but you should expect to read them.
- **It is 2D only.** There is no 3D pipeline and none is planned.
- **The target is the browser.** There is no console export and no native desktop or
  mobile packaging, though browser games do run on mobile.
- **It requires a secure context.** The engine uses browser APIs that are only available
  over HTTPS or on `localhost`.
- **It is a small project.** There is no asset store, no plugin marketplace, and no
  commercial support.

If you need any of those, a larger engine will serve you better.

## Next

- [How it works](/introduction/how-it-works/) walks the path from configuration to a
  running frame.
- [Installation & setup](/getting-started/installation/) gets a project running.
- The [API reference](/api/) documents every public class and method.
