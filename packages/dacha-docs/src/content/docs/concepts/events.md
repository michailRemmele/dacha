---
title: "Events"
description: "How actors, scenes and the world dispatch and receive events."
---

Actors, scenes and the world are all event targets. Events are queued and delivered
through a shared queue, with an immediate-dispatch escape hatch for the cases that
genuinely need a synchronous reaction.

## What this page will cover

- Event targets and where each sits in the hierarchy
- The shared event queue and when delivery actually happens
- Immediate dispatch, and when reaching for it is correct
- Event bubbling through the actor hierarchy
- The typed event maps
- Declaring project events and pointing the editor at them
