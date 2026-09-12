---
title: "Systems & global options"
description: "Choose which systems run and tune the global options."
---

Two parts of a game belong to no scene: the list of systems the game runs, and the global
options every scene shares. You edit both in the inspector, in its Systems tab and its
Project settings tab.

## The systems list

The Systems tab lists the systems the game runs. *Add System* offers every system the editor
knows about, which means the engine's own systems plus the ones in your project. The editor
learns about yours from the [file naming convention](/game-code/auto-registration/).

Each entry in the list expands to the options of that system. A system with no options says so
instead.

## Order is execution order

Drag an entry to move it. The order matters: the engine creates systems in this order, and
calls `update` and `fixedUpdate` on them in this order, every frame.

This is why the systems list is draggable and the component list is not. A component is data,
so the inspector sorts components alphabetically. Systems act, and the order of their actions
shows up on screen. Put the renderer after the systems that move things, or it draws positions
that are one step old.

World systems and scene systems live in the same list. The engine decides which is which from
the class you wrote. It creates the world systems once and the scene systems with each scene,
and runs them all in the order the list gives.

## Where system options live

The editor writes the list to the project configuration, as one entry per system with its
`options` beside its name. The options belong to the system, not to a scene. A scene system is
created again for every scene, and it receives the same options each time.

## Global options

The Project settings tab has four panels under `Global Options`.

**Sorting** decides draw order. It lists the named layers an actor can be drawn in, and the
order used inside a layer. Drag the layers to change which one covers which. Adding or
removing a layer needs the editor to restart, so *Reload Required* appears in the bottom bar
when you touch them. [Rendering](/systems/rendering/) explains what the layers do.

**Physics** lists the collision layers and the matrix that says which pairs of layers collide.
A new layer collides with everything until you clear the boxes. See
[Physics](/systems/physics/).

**Audio Groups** names the buses a sound can play through, so you can set the volume of music
and effects separately. See [Audio](/systems/audio/).

**Performance** tunes the game loop with four numbers: `maxFPS`, `fixedUpdateRate`,
`maxFrameDelta` and `maxFixedUpdatesPerFrame`. [The game loop](/concepts/game-loop/) explains
what each of them changes, and what the defaults are.

## The editor writes names, not classes

Adding a system here writes its **name** into the project configuration. It does not make the
class available to the game. The engine gets its classes from your entry point, where you pass
them to `new Engine({ systems })`, so a system has to appear in both places.

The engine's own systems are no exception. `GameStatsMeter` added in this tab and never
imported in the entry point does nothing at all. The engine skips it, the game runs without
it, and the only sign is one line in the browser console:

```
System not found: GameStatsMeter
```

Your own systems avoid this when their filename matches the glob the entry point already has.

The editor checks nothing else here, because it does not run your game. A mistake in this tab
surfaces in the browser console, and [Troubleshooting](/reference/troubleshooting/) lists the
messages worth recognising.
