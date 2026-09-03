---
title: "Writing a component"
description: "Define a component with decorators and expose its fields to the editor."
---

A component is data attached to an actor. You declare one by extending `Component` and
describing it with a decorator.

## A complete component

```ts
import { Component } from 'dacha';
import { DefineComponent, DefineField } from 'dacha-workbench/decorators';

interface HealthConfig {
  points: number;
}

@DefineComponent({
  name: 'Health',
})
export default class Health extends Component {
  @DefineField({
    initialValue: 100,
  })
  points: number;

  maxPoints: number;

  constructor(config: HealthConfig) {
    super();

    const { points } = config;

    this.points = points;
    this.maxPoints = points;
  }
}
```

That is the whole thing. Nothing else has to be registered anywhere.

## Reading it line by line

**`@DefineComponent({ name: 'Health' })`** gives the component the name used in the
configuration file and shown in the editor. The decorator is how a component is named;
you never assign a name yourself.

**`export default`** is required, because that is what the
[auto-registration glob](/writing-game-code/auto-registration/) collects.

**`@DefineField({ initialValue: 100 })`** exposes `points` in the inspector, seeded at 100
for new instances.

**`maxPoints` has no decorator**, and that contrast is the most useful thing on this page.
An undecorated property is ordinary runtime state: invisible to the editor, absent from the
saved configuration, and reset every time the component is constructed. Decorate what a
designer should be able to tune; leave everything else alone.

**The constructor receives the saved field values** as one object. Derived state is
computed there, which is what `maxPoints` is doing.

## Components hold no logic

There is no `update` on a component and there should be no methods that do work. Logic
belongs in a [system](/writing-game-code/systems/) when it applies to a class of actors, or
a [behavior](/writing-game-code/behaviors/) when it applies to one.

This is not style advice. A component is serialised into the configuration and rebuilt from
it, so anything not expressible as data will not survive the round trip.

## Using it

Once the file exists, the component is available in the editor's inspector for any actor,
and in code by class:

```ts
import Health from '../components/health/health.component';

const health = actor.getComponent(Health);
if (health) {
  health.points -= 10;
}
```

:::note
Decorators are currently imported from `dacha-workbench/decorators`. They are planned to
move into the `dacha` package. When that happens this import path changes and these pages
will be updated.
:::

## Generating one instead

The editor can write this file for you, with the decorator and the class already in place.
See [generating scripts](/editor/generating-scripts/).
