---
title: "Rendering"
description: "Draw actors on screen with the pixi.js-backed renderer."
---

Rendering is handled by the `Renderer`, built on [pixi.js](https://pixijs.com/). It is a
world system, so it is created once and survives scene changes, keeping its GPU state
across levels.

## Registering it

```ts
import { Engine, Renderer, Transform, Sprite, Camera } from 'dacha';

const engine = new Engine({
  config,
  systems: [Renderer],
  components: [Transform, Sprite, Camera],
});
```

A scene needs a camera to be visible. Types specific to rendering are published under the
`dacha/renderer` subpath, which exports **types only**; values come from `dacha`.

## Draw order is configuration, not actor order

Which actor appears in front is decided by the `sorting` entry in
[`globalOptions`](/concepts/configuration/), not by the order actors appear in the scene.
It defines the named layers actors can be assigned to, and a sorting order within a layer.

A fresh project starts with one layer named `default` and the order `bottomRight`, meaning
actors lower and further right are drawn on top. That is the usual choice for a
top-down game where things nearer the camera should overlap things further away.

## Components

| Component | What it draws |
| --- | --- |
| `Sprite` | An image from a texture asset |
| `Shape` | Vector geometry with fill and stroke |
| `BitmapText` | Text using a bitmap font |
| `Mesh` | Custom geometry |
| `PixiView` | An escape hatch for driving pixi.js directly |
| `Camera` | Not drawn; defines the view. See [Camera](/systems/camera/). |

## What this page will cover

The sections below are outlined but not yet written.

- Each drawing component in detail, with its fields
- Texture assets and how sprites reference them
- Bitmap fonts and text rendering
- Layers, assigning actors to them, and sorting within a layer
- Filter effects and shaders, supplied through the renderer's `resources`
- `PixiView` and when dropping to raw pixi.js is the right call
- The renderer's system API

## See also

- [Camera](/systems/camera/) controls what is visible.
- [Interpolation](/systems/interpolation/) makes fixed-step motion draw smoothly.
- [Animation](/systems/animation/) drives component values over time.
