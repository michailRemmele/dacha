---
title: "Character Controller"
description: "Move a character with collision response and without a rigid body."
---

A character rarely wants full rigid-body simulation. The character controller moves a
character body along a requested direction, resolving collisions as it goes, which gives
responsive movement that still respects the world geometry.

## What this page will cover

- Registering the controller
- The character body component
- Requesting movement
- Ground detection and slopes
- Interaction with the physics system
- Common movement patterns
