---
title: "Migration guides"
description: "Breaking changes between versions, and what to do about them."
---

dacha is before version 1.0. Breaking changes land between minor versions, and they are
not deprecated first. Each entry below says what changed, why, and what to do in your
project.

Entries are newest first. Where an entry does not name a version, the change is recorded
because it affects code written against older documentation, and the exact boundary should
be confirmed against the release history before relying on it.

## Unreleased

Nothing yet.

## Assets are reached through constructor options

**What changed.** `world.assets` was removed. Assets are no longer looked up from a
registry hanging off the world.

**Why.** Assets became runtime class instances rather than plain records, and reaching them
through a global registry made their lifetime ambiguous. Passing them in makes ownership
explicit.

**What to do.** A system receives `assets` in its options object. Take what you need there
and keep it, rather than reaching for the world:

```ts
constructor(options: SceneSystemOptions) {
  super();
  this.assets = options.assets;
}
```

Any code still calling `world.assets` will fail to compile.

:::caution
Asset handling is still being reworked. This documentation deliberately does not yet
describe asset kinds or loading in detail, because that surface is expected to change
again.
:::

## Physics body sleeping was removed

**What changed.** Per-body sleeping is gone. Every body is simulated every step.

**Why.** The previous implementation put individual bodies to sleep, which produced wrong
results when a sleeping body should have been woken by a neighbour. It will return as an
island-based implementation, where connected groups of bodies sleep together.

**What to do.** Nothing, unless you wrote code that reads or sets a sleep state, which will
no longer compile. Do not write code that assumes bodies sleep, and do not write code that
assumes they never will.

## Planned: decorators move into the engine

Decorators are currently imported from `dacha-workbench/decorators`. They are planned to
move into the `dacha` package, so that a game project describing its own classes does not
need to depend on the editor package at all.

Nothing to do yet. When the move lands, the remediation in a project is a single
find-and-replace across imports:

```bash
grep -rl "dacha-workbench/decorators" src \
  | xargs sed -i '' "s|dacha-workbench/decorators|dacha|g"
```

The empty string after `-i` is required on macOS and must be dropped on Linux.
