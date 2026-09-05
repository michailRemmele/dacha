---
title: "Your first scene"
description: "Build a scene in the editor, put an actor in it, and run the game."
---

This walkthrough takes the empty project created by
[`dacha-workbench init`](/getting-started/installation/) and produces a running game with
one visible actor. It assumes no prior knowledge of the editor.

## Open the editor

```bash
npx dacha-workbench
```

On first launch there is no scene, so the viewport is empty and the explorer shows an
empty project tree.

:::note[Screenshot needed]
The editor on first launch against a freshly initialised project: empty viewport, empty
explorer, inspector showing nothing selected.
:::

## Create a scene

Add a scene from the explorer and give it a name. A scene is a level, a menu or any other
distinct game state, and it is the container every actor lives in.

Then mark it as the **start scene**. The engine refuses to start without one, so this step
is not optional. It corresponds to `startSceneId` in the configuration.

:::note[Screenshot needed]
The explorer with one scene created and marked as the start scene.
:::

## Add an actor

Add an actor to the scene. It arrives with a `Transform` already attached, because every
actor has one; it carries the position, rotation and scale that everything else builds on.

Select the actor and look at the inspector. The `Transform` values are editable there, and
changing the position moves the actor in the viewport.

## Give it something visible

A `Transform` alone draws nothing. Add a `Sprite` component to the actor and point it at
an image.

Put an image file into `data/assets/` first, then select it in the sprite's field. The
editor reads that directory, so anything you drop in becomes selectable without a restart.

:::note[Screenshot needed]
The inspector for the selected actor showing Transform and Sprite, with the sprite
pointing at an asset, and the actor visible in the viewport.
:::

## Save and look at the result

Save the project. The editor writes `data/data.json`, and it is worth opening that file
once to see what changed: the scene you created, the actor inside it, the two components
and their values are all there as plain data. Nothing is hidden in a binary format.

This is the whole idea behind
[data-driven configuration](/concepts/configuration/).

## Run the game

Press play in the editor to run the scene using the real engine.

:::note[Screenshot needed]
The scene running inside the editor, with the playback controls active.
:::

To run it outside the editor you need a bundler and an entry point that constructs the
engine. The shortest version:

```ts
import { Engine, Renderer, Transform, Sprite } from 'dacha';

import config from '../data/data.json';

const engine = new Engine({
  config,
  systems: [Renderer],
  components: [Transform, Sprite],
});

void engine.play();
```

The systems and components you pass have to cover everything the configuration refers to.
A scene using a `Sprite` needs the `Renderer` in the list, or `play()` will throw.

Remember that the page must be served over HTTPS or from `localhost`.

## Next

- [Build a garden](/tutorials/garden/) carries this the rest of the way, from an empty
  project to a game you can play.
- [ECS in dacha](/concepts/ecs/) explains what actors, components and systems actually are.
- [Writing a component](/writing-game-code/components/) is the next step once the built-in
  components stop being enough.
