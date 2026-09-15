---
title: "Physics"
description: "Move bodies, detect collisions and ask spatial questions with the 2D physics system."
---

`PhysicsSystem` simulates 2D physics for the actors of the active scene. It does three things:

- It moves actors that have a `RigidBody`. Gravity, forces, collisions, bounce and friction change
  how they move.
- It finds actors whose colliders touch, and sends [collision events](/systems/physics/collisions/)
  to them.
- It answers [spatial questions](/systems/physics/queries/), such as "what does this ray hit?".

Two components take part:

| Component | What it does |
| --- | --- |
| `Collider` | Gives an actor a shape: a box, a circle, a capsule or a segment |
| `RigidBody` | Makes the actor a body. The physics system moves it, or other bodies stop at it |

## What each combination does

An actor can have a collider, a body, or both. The combination decides what the actor does:

| The actor has | It moves | Dynamic bodies stop at it | It gets collision events |
| --- | --- | --- | --- |
| `Collider` only | No | No | Yes |
| `Collider` and a `static` `RigidBody` | No | Yes | Yes |
| `Collider` and a `dynamic` `RigidBody` | By the simulation | Yes | Yes |
| `Collider` and a `kinematic` `RigidBody` | By your code | Yes | Yes |
| `RigidBody` only | Like with a collider | No | No |

The physics system stops a body only when both actors have a `RigidBody`, and at least one of them
is `dynamic`. A `kinematic` body passes through `static` and other `kinematic` bodies.

A collider without a body is a **trigger**. It reports what touches it, and everything passes
through it. Use it for pickups, checkpoints and damage zones.

Two actors with `static` bodies never collide with each other, and they get no events about
each other.

## Setting it up

The [starter project](/getting-started/installation/) does not include physics. To add it:

1. In the Systems tab, add *Physics System*.
2. Add the classes to the engine in `src/index.ts`:

   ```ts
   import { Engine, PhysicsSystem, Transform, Collider, RigidBody } from 'dacha';

   const engine = new Engine({
     config,
     systems: [PhysicsSystem, ...gameSystems],
     components: [Transform, Collider, RigidBody, ...gameComponents],
     assets: [],
   });
   ```

3. Add `Collider` and `RigidBody` to your actors.

The editor viewport does not run physics. To see bodies move, run the game. To see the collider
shapes in the editor, turn on the *Colliders* [debug layer](/editor/interface-tour/#debug-layers).

### Options

`PhysicsSystem` has these options:

| Option | Default | What it does |
| --- | --- | --- |
| `gravityX` | `0` | Horizontal gravity, in world units per second squared |
| `gravityY` | `980` | Vertical gravity, in world units per second squared. The y axis points down, so a positive value pulls bodies down |
| `solverIterations` | `8` | How many times per step the solver works on the contacts. More iterations make stacks of bodies more stable, and use more CPU |
| `maxAllowedPenetration` | `0.5` | How deep, in world units, bodies can overlap before the solver pushes them apart. A small overlap stops resting bodies from shaking |
| `maxBiasVelocity` | `60` | The highest speed, in world units per second, at which the solver pushes overlapping bodies apart |

The defaults suit most games. Change `solverIterations` first if stacked bodies sink into each
other or shake.

### Order in the systems list

`PhysicsSystem` does its work in `fixedUpdate`. Put it after the systems that control bodies in
`fixedUpdate`: the ones that apply forces, set velocity or call `movePosition`. Their changes then
apply in the same step. A change made by a system below `PhysicsSystem` applies one step later.

Put [`CharacterController`](/systems/character-controller/) before `PhysicsSystem`, and
[`Interpolator`](/systems/interpolation/) after it.

The engine runs every `fixedUpdate` of a frame before any `update`. So a system that reads positions
in `update` sees this frame's physics, wherever it is in the list. See [hook
ordering](/concepts/game-loop/#hook-ordering).

Collision events are queued like other events. Your listeners get them at the start of the next
frame, before the next `fixedUpdate`. See [delivery happens on the next
frame](/concepts/events/#delivery-happens-on-the-next-frame).

## Changing gravity at runtime

`PhysicsAPI` reads and changes gravity:

```ts
import { PhysicsAPI, Vector } from 'dacha';

const physics = world.systemApi.get(PhysicsAPI);

physics.gravity = new Vector(0, -980);
```

`PhysicsSystem` is a scene system, so each scene has its own. A new scene starts with the gravity
from the options. A change applies only to the scene where you make it.

The physics system registers `PhysicsAPI` when its scene starts, and removes it when the scene
exits. `systemApi.get` throws when the API is not registered. So get it in `onSceneEnter` or
later, not in a constructor. In a world system, check `world.systemApi.has(PhysicsAPI)` first.

## Types

The `dacha/physics` subpath exports the types of the physics system: its options, the query
parameters, and the hit results. It exports **types only**. Import classes and values from
`dacha`:

```ts
import { PhysicsAPI } from 'dacha';
import type { CastHit, PhysicsSystemOptions } from 'dacha/physics';
```
