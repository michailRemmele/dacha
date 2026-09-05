---
title: "Actors, Transform & hierarchy"
description: "The entity that owns components and forms the scene graph."
---

An actor is the thing a game is made of. It owns components, it can own child actors, and
it is always created with a `Transform`.

## Reading components

An actor's components are reached by class, not by string:

```ts
import { Transform, Sprite } from 'dacha';

const transform = actor.getComponent(Transform);
const sprite = actor.getComponent(Sprite);
```

Passing the class rather than a name is what lets TypeScript infer the component's type,
so `transform.world.position.x` is checked at compile time.

An actor may not have the component you ask for, so guard when it is optional:

```ts
const sprite = actor.getComponent(Sprite);
if (!sprite) {
  return;
}
```

## Transform is always there

`Transform` is the one component every actor carries. It holds position, rotation and
scale, and it is the component almost everything else builds on: the renderer draws at its
position, physics moves it, the camera follows it.

It is also the one built-in component that belongs to no system, which is why it is
documented here rather than on a system page. Every other component is documented
alongside the system that reads it; see the
[components index](/reference/components/).

## The hierarchy

Actors form a tree. An actor can have children, and a child's transform is expressed
relative to its parent, which is what makes composite objects work: a character with a
weapon attached, a platform with riders on it, a health bar following a unit.

Scenes and the world are part of the same tree structure, because all three extend a
shared base that provides the hierarchy.

## Finding actors

By name, searching recursively by default:

```ts
const player = scene.findChildByName('Player');
```

By identifier, when you have stored one:

```ts
const actor = scene.findChildById(savedId);
```

Both return `undefined` when nothing matches, so check the result. Both also walk the
whole subtree unless you pass `false` as the second argument to limit the search to
direct children.

For finding actors by what they *have* rather than what they are called, use a query
instead. That is what systems do; see [ECS in dacha](/concepts/ecs/).

## Templates and spawning

An actor can be created at runtime from a template rather than being placed in the scene
ahead of time. Systems receive an actor spawner in their options for exactly this, which
is how bullets, enemies and particles come into existence mid-game.

The template a spawned actor comes from is the same one the editor shows you, so an actor
spawned at runtime and one placed by hand are identical.

## Actors are event targets

An actor can dispatch events and listen for them, and events bubble up through the
hierarchy to the scene and the world. This is how collision reports and input actions
reach the code that responds to them.

See [events](/concepts/events/).
