---
title: "Build a garden"
description: "A complete small game, from an empty project to something you can play."
---

Every other section of this documentation explains one piece of the engine on its own. This
tutorial puts the pieces together: it starts from an empty project and ends with a small
game you can play in a browser — a gardener who waters beds of plants while they grow
through their stages.

It is the same scene that runs on the front page of this site, which is deliberate. There
it plays itself with no input; here you build the version that takes yours. The difference
between the two is a few entries in the systems list, and seeing that is half the point of
the exercise.

## What this tutorial will cover

- Setting up the project and getting a scene on screen
- Drawing the garden from a tile map
- A plant as a template, placed across a bed
- Growth stages as a behavior, because each plant keeps its own timer
- The gardener: input, movement and collision
- Watering as a system that queries the plants within range
- Sound, a score, and the transition between playing and finishing
- Building the game and putting it somewhere people can open it

## Not written yet

This tutorial is being written alongside the game it builds. Until it lands,
[your first scene](/getting-started/first-scene/) is the shortest path to something running,
and [the core concepts](/concepts/ecs/) explain the model the tutorial assumes.
