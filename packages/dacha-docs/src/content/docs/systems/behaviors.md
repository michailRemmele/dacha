---
title: "Behaviors"
description: "The system that runs behaviors, and when it creates and destroys them."
---

`BehaviorSystem` runs the behaviors attached to actors.

To write a behavior and attach it in the editor, see [Behaviors](/game-code/behaviors/) in
Game Code.

## Setting it up

1. In the Systems tab, add *Behavior System*.
2. Add `BehaviorSystem`, `Behaviors` and the project's `gameBehaviors` to the engine:

```ts
import { Engine, BehaviorSystem, Behaviors } from 'dacha';

const engine = new Engine({
  config,
  systems: [BehaviorSystem, ...gameSystems],
  components: [Behaviors, ...gameComponents],
  assets: [],
  resources: {
    [BehaviorSystem.systemName]: [...gameBehaviors],
  },
});
```

## The `Behaviors` component

The component has one field, `list`. It holds the behaviors of the actor, in the order they run.
Each entry has three fields:

| Field | What it is |
| --- | --- |
| `id` | An identifier for the entry. The editor creates it |
| `name` | The `behaviorName` of the class to create |
| `options` | Values for the behavior's fields. The system passes them to the constructor |

## When instances are created and destroyed

`BehaviorSystem` is a scene system, so each scene gets its own copy. It creates the behavior
instances for an actor when:

- the scene becomes active,
- an actor with `Behaviors` is added to the active scene,
- an actor in the active scene gets a `Behaviors` component.

It calls `destroy` on the instances of an actor when:

- the actor is removed from the scene,
- the `Behaviors` component is removed from the actor,
- the scene is destroyed.

## Changing behaviors at runtime

The system reads `Behaviors` only when it creates the instances. If you update the component later, the
running instances do not change.

To change the behaviors of an actor, replace the whole component:

```ts
actor.setComponent(
  new Behaviors({
    list: [{ id: 'patrol', name: 'Patrol', options: { speed: 2 } }],
  }),
);
```

`setComponent` removes the old component first, so the system destroys the old instances. Then
it adds the new component, so the system creates instances from the new list.

## Where behaviors run in the frame

When `BehaviorSystem` gets its turn in the systems list, it calls `update` and `fixedUpdate` on every behavior of every actor.

## API reference

- [`BehaviorSystem`](/api/classes/BehaviorSystem.html)
- [`Behaviors`](/api/classes/Behaviors.html)
- [`Behavior`](/api/classes/Behavior.html)
