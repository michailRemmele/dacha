---
title: "Scenes, World & systemApi"
description: "The containers above the actor, and the registry that exposes built-in systems to your code."
---

Above the actor there are two containers. A **scene** holds actors. The **world** holds
scenes and everything global.

## Scenes

A scene is a level, a menu, a game-over screen: any distinct state your game can be in.
It contains actors, and it can have its own systems that exist only while it is loaded.

One scene is loaded at a time. Changing scenes destroys the current scene's systems and
actors and builds the next scene's, which is why anything that must outlive a scene change
belongs to the world instead.

## The world

The world is the root. It owns the scenes, it hosts the systems that persist across scene
changes, and it exposes the registry described below.

Like scenes and actors, the world is an event target, so world-level events are a place to
put things that concern the whole game rather than one level.

## `systemApi`

Built-in systems do useful things your code will want to ask about. Physics can answer
spatial questions. The interpolator can give you a smoothed render position. The camera
system knows which camera is current.

Rather than handing you system instances, the world exposes a registry keyed by API class:

```ts
import { PhysicsAPI } from 'dacha';

const physics = world.systemApi.get(PhysicsAPI);
```

The class is both the key and the type, so the result is typed without a cast.

Five systems register an API today:

| System | API |
| --- | --- |
| Renderer | drawing and view queries |
| Physics | spatial queries |
| Camera | the current camera |
| Audio | playback control |
| Interpolator | render transforms |

Each is covered on its own page under [built-in systems](/systems/rendering/).

### What happens when it is missing

`get` throws when nothing is registered for that class, with a message naming it. In
practice this means one thing: the system that provides the API was not included in the
`systems` array passed to the `Engine`. Asking for `PhysicsAPI` without `PhysicsSystem`
running is a configuration mistake, and failing loudly beats returning `undefined` and
crashing three frames later.

Registration happens as the providing system starts up, so resolve an API when you need it
rather than caching it in a constructor that may run first.

### Why the indirection

A direct reference would couple your code to a system instance, its construction order and
its internals. The registry keeps the surface narrow: a system decides what it exposes, and
everything else is private. It also means a system can be swapped or absent without every
caller holding a broken reference.
