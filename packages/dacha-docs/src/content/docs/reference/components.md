---
title: "Components index"
description: "Every built-in component, and where it is documented."
---

Components in Dacha are documented alongside the system that reads them, because a
component on its own does nothing: `Collider` is meaningless without physics running,
`Sprite` without the renderer. Splitting them into a separate reference would mean two
places to look and two places to keep current.

This page is the lookup table. Find the name you saw in the inspector, follow it to the
page that explains it in context.

| Component | What it is | Documented in |
| --- | --- | --- |
| `Animatable` | Animation timelines attached to an actor | [Animation](/systems/animation/) |
| `AudioSource` | A sound attached to an actor | [Audio](/systems/audio/) |
| `Behaviors` | The behaviors attached to an actor | [Behaviors](/systems/behaviors/) |
| `BitmapText` | Text drawn with a bitmap font | [Rendering](/systems/rendering/) |
| `Camera` | Defines the view | [Camera](/systems/camera/) |
| `CharacterBody` | Controlled movement with collision response | [Character Controller](/systems/character-controller/) |
| `Collider` | A collision shape | [Physics](/systems/physics/) |
| `Interpolation` | Smooths rendering between fixed steps | [Interpolation](/systems/interpolation/) |
| `KeyboardControl` | Maps keys to game actions | [Input](/systems/input/) |
| `Mesh` | Custom geometry | [Rendering](/systems/rendering/) |
| `MouseControl` | Maps mouse input to game actions | [Input](/systems/input/) |
| `PixiView` | Direct access to pixi.js for one actor | [Rendering](/systems/rendering/) |
| `RigidBody` | Simulated body with mass and velocity | [Physics](/systems/physics/) |
| `Shape` | Vector geometry with fill and stroke | [Rendering](/systems/rendering/) |
| `Sprite` | An image from a texture asset | [Rendering](/systems/rendering/) |
| `Transform` | Position, rotation and scale | [Below](#transform) |

## `Transform`

`Transform` belongs to no system, so it has no system page to live on. [Actors](/concepts/actors/#transform)
explains what `local` and `world` mean. This is the field list.

The configuration and the runtime object spell the same values differently:

| Where | Field | Unit |
| --- | --- | --- |
| Configuration and inspector | `offset` | pixels |
| Configuration and inspector | `rotation` | degrees |
| Configuration and inspector | `scale` | factor |
| Runtime | `local.position`, `world.position` | pixels |
| Runtime | `local.rotation`, `world.rotation` | radians |
| Runtime | `local.rotationDeg`, `world.rotationDeg` | degrees |
| Runtime | `local.scale`, `world.scale` | factor |

`offset` becomes `local.position` at runtime. Rotation is stored in radians, and `rotationDeg`
reads and writes the same value in degrees:

```ts
transform.local.rotationDeg = 90;
transform.local.rotation = Math.PI / 2; // the same thing
```

:::caution
Assign to the axis, not to the whole vector. `position` and `scale` are objects with `x` and
`y` accessors that convert between local and world space and mark the transform dirty.
Replacing the object throws those accessors away.

```ts
transform.world.position.x = 100;   // correct
transform.world.position.y = 40;

transform.world.position = { x: 100, y: 40 };   // wrong: breaks the transform
```
:::

## Your own components

Components you write appear in the inspector alongside these. See
[writing a component](/game-code/components/).

## Field-level detail

This table says what each component is for, not what every field does. For the exhaustive
list of properties, types and methods, see the [API reference](/api/).
