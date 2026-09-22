---
title: "All components"
description: "Every built-in component, and where it is documented."
---

Components in Dacha are documented alongside the system that reads them, because a
component on its own does nothing: `Collider` is meaningless without physics running.

This page lists all components available out of the box in Dacha.

| Component | What it is | Documented in |
| --- | --- | --- |
| `Animatable` | Animation attached to an actor | [Animation](/systems/animation/) |
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

The editor's inspector and the runtime object spell the same values differently:

| Where | Field | Unit |
| --- | --- | --- |
| Inspector | `offset` | pixels |
| Inspector | `rotation` | degrees |
| Inspector | `scale` | factor |
| Runtime | `local.position`, `world.position` | pixels |
| Runtime | `local.rotation`, `world.rotation` | radians |
| Runtime | `local.rotationDeg`, `world.rotationDeg` | degrees |
| Runtime | `local.scale`, `world.scale` | factor |

Rotation is stored in radians, and `rotationDeg` reads and writes the same value in degrees:

```ts
transform.local.rotationDeg = 90;
transform.local.rotation = Math.PI / 2; // the same thing
```

## Field-level detail

This table says what each component is for, not what every field does. For the exhaustive
list of properties, types and methods, see the [API reference](/api/).
