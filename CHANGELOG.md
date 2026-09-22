# Changelog

All notable changes to `dacha`, `dacha-workbench` and `create-dacha`. The three packages
share one version number, so they share this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the
project follows [semantic versioning](https://semver.org/spec/v2.0.0.html). While the
version stays below 1.0.0, a minor bump may carry breaking changes.

Releases made before this file existed are recorded in the
[git tags](https://github.com/michailRemmele/dacha/tags).

## Unreleased

### Added

- A documentation site at [dachajs.org](https://dachajs.org/).
- `dacha` exports the types that appear in its public signatures: `EngineOptions`,
  `ActorOptions`, `ActorQueryOptions`, `Entity`, `EntityOptions`, `SystemAPIRegistry`,
  `Matrix`, the `Transform` parts (`LocalTransform`, `WorldTransform`, `LocalPoint`,
  `WorldPosition`, `WorldScale`), the collider and shape config variants, `PixiViewConfig`,
  `BehaviorConfig`, `MaterialConfig` and the keyboard and mouse binding types.
- `dacha/events` exports `ActorQueryEventMap`, `CollisionEvent` (the fields shared by
  the three collision events) and the input event types `CustomKeyboardEvent`,
  `CustomMouseEvent`, `InputEventAttributeConfig`, `InputEventAttributes` and
  `AttributeValue`.
- `dacha/renderer` exports `ShaderUniform`, `ShaderUniformType` and `ShaderUniformValue`.

### Changed

- The event types in `dacha/events` (`LoadSceneEvent`, `CollisionEnterEvent`,
  `KeyboardInputEvent` and the others) are interfaces instead of type aliases. They have the
  same fields, so code that uses them does not change.

### Fixed

- `AddActorEvent` and `RemoveActorEvent` type `target` as the `ActorQuery` that dispatches
  them. They typed it as a `Scene` before, which never matched the object a listener got.
