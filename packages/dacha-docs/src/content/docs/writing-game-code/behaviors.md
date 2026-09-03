---
title: "Writing a behavior"
description: "Define a behavior and attach it to an actor."
---

A behavior is logic scoped to one actor. It is declared much like a system, with a
decorator that names it, but it receives the actor it belongs to and runs only for that
actor.

## What this page will cover

- The decorator that names it
- What the options argument carries
- The lifecycle methods available
- Attaching a behavior to an actor in the editor
- Registering behaviors with the engine
- When a system is the better choice
