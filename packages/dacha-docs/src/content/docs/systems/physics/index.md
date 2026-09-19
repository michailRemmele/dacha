---
title: "Physics"
description: "Move bodies, detect collisions and ask spatial questions with the 2D physics system."
---

`PhysicsSystem` simulates 2D physics for the actors of the active scene. It does three things:

- It moves actors that have a `RigidBody`. Gravity, forces, collisions, bounce and friction change
  how they move.
- It finds actors whose colliders overlap, and sends [collision events](/systems/physics/collisions/)
  to them.
- It answers [spatial questions](/systems/physics/queries/), such as "what does this ray hit?".

Two components take part:

| Component | What it does |
| --- | --- |
| `Collider` | Gives an actor a shape: a box, a circle, a capsule or a segment |
| `RigidBody` | Makes the actor participate in physics. The physics system moves it, or other bodies stop at it. |

## What each combination does

An actor can have a collider, a body, or both:

- **`Collider` only.** It gets collision events, and everything passes through it. This is a
  **trigger**. Use it for pickups, checkpoints and damage zones.
- **`Collider` and a `RigidBody`.** Dynamic bodies stop at it, and it gets collision events. The
  [body type](/systems/physics/bodies-and-colliders/#body-types) decides what moves it: the
  simulation, or your code.
- **`RigidBody` only.** Physics moves it, but it has no shape. It collides with nothing, and it
  gets no events.

You can move any actor by changing its `Transform`. Physics does not stop you. The actor jumps to
the new position with no velocity, so it does not push other bodies on the way. `static` does not
lock an actor in place. It means that the simulation never moves the actor itself. See [moving
a body through Transform](/systems/physics/bodies-and-colliders/#moving-a-body-through-transform).

## Setting it up

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

To see bodies move, run the game. To see the collider shapes in the editor, turn on the *Colliders* [debug layer](/editor/interface-tour/#debug-layers).

### Options

`PhysicsSystem` has these options:

| Option | Default | What it does |
| --- | --- | --- |
| `gravityX` | `0` | Horizontal gravity, in world units per second squared |
| `gravityY` | `980` | Vertical gravity, in world units per second squared |
| `solverIterations` | `8` | How many times per step the solver works on the contacts. More iterations make stacks of bodies more stable |
| `maxAllowedPenetration` | `0.5` | How deep, in world units, bodies can overlap before the solver pushes them apart. A small overlap stops resting bodies from shaking |
| `maxBiasVelocity` | `60` | The highest speed, in world units per second, at which the solver pushes overlapping bodies apart |

### Order in the systems list

`PhysicsSystem` does its work in `fixedUpdate`. Put it after the systems that control bodies in
`fixedUpdate`: the ones that apply forces, set velocity or call `movePosition`. Their changes then
apply in the same step. A change made by a system below `PhysicsSystem` applies one step later.

## Physics API

`PhysicsAPI` is the runtime interface of the physics system. It reads and changes gravity, and it
answers [queries](/systems/physics/queries/): raycasts, shape casts and overlap tests.

```ts
import { PhysicsAPI, Vector } from 'dacha';

const physics = world.systemApi.get(PhysicsAPI);

physics.gravity = new Vector(0, -980);
```

`PhysicsSystem` is a scene system, so each scene has its own gravity. A new scene starts with the
gravity from the options, and a change applies only to the scene where you make it.

`PhysicsAPI` exists only while a scene with `PhysicsSystem` is active. Get it where you use it, not
in a constructor. See [resolve an API where you use
it](/concepts/scenes-and-world/#resolve-an-api-where-you-use-it).
