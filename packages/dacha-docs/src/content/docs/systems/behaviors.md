---
title: "Behaviors"
description: "Per-actor logic, and when to prefer it over a system."
---

A behavior attaches to a single actor and runs for that actor alone. Where a system sweeps
every actor matching a query, a behavior is scoped to the one actor that holds it, which
makes it the natural home for logic that is genuinely per-object.

Like the renderer and the physics system, the behavior system is opt-in: it is registered
with the engine, and actors take part by carrying a `Behaviors` component.

## What this page will cover

- What a behavior is and how it is attached
- The `Behaviors` component and the behavior system
- The behavior lifecycle
- What a behavior receives on construction
- Choosing between a behavior and a system
- Registering the behavior system with the engine
- Editor support: attaching and configuring behaviors in the inspector
