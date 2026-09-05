---
title: "Physics"
description: "Colliders, bodies, collision events and spatial queries."
---

The physics system simulates bodies, resolves collisions and answers spatial questions. It
runs on the fixed timestep, so anything you do with it belongs in `fixedUpdate`.

## Registering it

```ts
import { Engine, PhysicsSystem, Collider, RigidBody, Transform } from 'dacha';

const engine = new Engine({
  config,
  systems: [PhysicsSystem],
  components: [Transform, Collider, RigidBody],
});
```

Types specific to physics are also published under the `dacha/physics` subpath. That
subpath exports **types only**; values always come from `dacha` itself.

## Components

| Component | What it does | Key fields |
| --- | --- | --- |
| `Collider` | Gives an actor a collision shape | `shape`, `offset`, `layer`, `disabled`, `debugColor` |
| `RigidBody` | Full simulation: forces, velocity, mass | `type`, `mass`, `friction`, `restitution`, `linearVelocity`, `angularVelocity`, `gravityScale`, `linearDamping`, `angularDamping`, `lockRotation`, `disabled` |
| `CharacterBody` | Controlled movement with collision response | see [Character Controller](/systems/character-controller/) |

A `Collider` alone makes an actor solid and lets it report collisions. Adding a
`RigidBody` makes it move under simulation.

### Collider layers

`layer` is a string naming which collision layer the collider belongs to. Layers decide
what can collide with what, which is how you stop the player's hitbox from colliding with
its own bullets without filtering in every listener.

### Body types

`RigidBody.type` is one of three, and it is read-only after construction:

| Type | Moves | Affected by forces | Use for |
| --- | --- | --- | --- |
| `static` | No | No | Walls, ground, anything fixed |
| `dynamic` | Yes | Yes | Crates, debris, projectiles |
| `kinematic` | Yes | No | Moving platforms, doors, anything script-driven |

A `kinematic` body pushes `dynamic` bodies but is not pushed back, which is what makes a
moving platform behave like a platform rather than a see-saw.

`gravityScale` multiplies world gravity for one body: `0` ignores gravity entirely, `1` is
normal. `lockRotation` stops a body spinning from torque or glancing contacts, which is
almost always what you want for a character or a projectile.

## Collision events

Collisions arrive as events on the actor:

| Event | Fires |
| --- | --- |
| `CollisionEnter` | The first step two colliders overlap |
| `CollisionStay` | Every step they continue to overlap |
| `CollisionLeave` | The step they stop overlapping |

Each carries the same payload:

| Field | What it is |
| --- | --- |
| `actor` | The other actor in the collision |
| `normal` | Collision normal, pointing from this actor toward the other |
| `penetration` | Depth of overlap along the normal |
| `contactPoints` | Contact manifold points in world space |

Listening for one:

```ts
import { CollisionEnter } from 'dacha/events';
import type { CollisionEnterEvent } from 'dacha/events';

actor.addEventListener(CollisionEnter, (event: CollisionEnterEvent) => {
  const { actor: other, normal, penetration } = event;
  // react to the hit
});
```

Because events bubble, a system can listen on the scene instead of on each actor and
handle every collision in one place.

## Spatial queries

Ask the physics system questions through its API rather than reading component state:

```ts
import { PhysicsAPI } from 'dacha';

const physics = world.systemApi.get(PhysicsAPI);
```

The query surface comes in three shapes: a method returning the first hit, an `All` variant
returning every hit, and an `Each` variant taking a callback so nothing is allocated.

| Query | What it asks |
| --- | --- |
| `raycast`, `raycastAll`, `raycastEach` | What does this ray hit? |
| `shapeCast`, `shapeCastAll`, `shapeCastEach` | What would this shape hit if swept along a direction? |
| `castActor`, `castActorAll`, `castActorEach` | Same, using an existing actor's collider |
| `overlapShape`, `overlapEach` | What is inside this shape right now? |
| `overlapActor`, `overlapActorEach` | What is overlapping this actor right now? |

The single-hit forms return `null` when nothing is hit, so check the result before using
it.

Gravity is on the same API as a property:

```ts
physics.gravity = { x: 0, y: 500 };
```

Prefer the `Each` variants inside `fixedUpdate` when a query runs every step for many
actors; the `All` variants allocate an array per call.

## What is not documented here

Broad-phase internals and the collision-detection pipeline are deliberately left out.
They are implementation detail and they change.

Bodies are currently always simulated. Per-body sleeping was removed and will return as an
island-based implementation, so do not write code that depends on either behaviour.

## See also

- [Character Controller](/systems/character-controller/) for character movement, which
  usually wants a `CharacterBody` rather than a `RigidBody`.
- [Interpolation](/systems/interpolation/) for making fixed-step motion look smooth.
- [The game loop](/concepts/game-loop/) for why physics runs on its own clock.
