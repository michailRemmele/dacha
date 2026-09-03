---
title: "Input"
description: "Keyboard, mouse and touch, and the split between raw input and game controls."
---

Input is deliberately handled in two stages. An input system reports raw device events,
and a control system maps those to game-meaningful actions declared on an actor. That
split is what lets the same game logic serve a keyboard and a touch screen.

## What this page will cover

- Why input and control are separate systems
- Keyboard input and keyboard control
- Mouse input and mouse control
- Declaring controls on an actor
- Handling control events in a system
- Feeding input from a user interface
