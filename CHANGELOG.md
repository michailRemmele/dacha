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
- `dacha`, `dacha/events` and `dacha/renderer` export the types that appear in their public
  signatures, such as `EngineOptions`, `ActorQueryEventMap`, `CollisionEvent` and
  `ShaderUniform`.
- `@DefineField` picks the widget from `initialValue` when there is no `type`: a number, a
  string, a boolean or an `{ x, y }` point. TypeScript checks the decorator against the field,
  so a bare `@DefineField()` on a non-string field, or an `initialValue` of the wrong type,
  fails to compile.
- A field with `@DefineField` fills itself. The engine takes the configuration value, then
  the field's initializer, then a copy of `initialValue`, so a component, behavior, system
  or asset no longer needs a constructor that copies its configuration. `Component`,
  `Behavior` and `System` accept the configuration in their constructors; a subclass with
  its own constructor passes it to `super`. Getters, setters and fields listed on the class
  decorator are not filled.
- `Component` takes the configuration type as a type parameter, `Component<Config>`. It
  types the configuration when code creates a component with `new`.

### Changed

- **Breaking:** the decorators (`DefineComponent`, `DefineSystem`, `DefineAsset`,
  `DefineBehavior`, `DefineShader`, `DefineFilterEffect`, `DefineField`) and `getSchema` moved
  from `dacha-workbench/decorators` to `dacha`, and that subpath is gone. They are standard
  (TC39) decorators: remove `experimentalDecorators` and `emitDecoratorMetadata` from
  `tsconfig.json`. `reflect-metadata` is no longer needed.
- **Breaking:** the field types moved to `dacha`, and `dacha-workbench` no longer exports
  them. Some have new names: `WidgetField` is `Field`, `Option` is `FieldOption`,
  `Dependency` is `FieldDependency`, `DependencyValue` is `FieldDependencyValue`,
  `GetOptionsFn` is `GetFieldOptionsFn`, `SectionSettings` is `SchemaSection` and
  `WidgetOptions` is `SchemaOptions`.
- **Breaking:** shaders and filter effects are separate from behaviors. `Shader.behaviorName`
  is now `Shader.shaderName`, and `FilterEffect.behaviorName` is now
  `FilterEffect.filterEffectName`. The editor configuration has separate `shaders` and
  `filterEffects` settings, and `behaviors` matches only `*.behavior.ts` by default.
  `useBehaviors` is replaced by `useSchemas(kind)`, and `BehaviorWidget` is removed: the
  inspector draws the options of behaviors, shaders and filter effects itself.
- **Breaking:** `dacha-workbench` has a peer dependency on `dacha` of the same version. The
  editor runs project code with its own engine, so npm now refuses to install the two
  packages at different versions.
- **Breaking:** the `subtract` blending mode was misspelled `substract`. A configuration that
  still says `"blending": "substract"` needs the new spelling.
- **Breaking:** `Section` from `dacha-workbench` no longer takes an `id`.
- `Sprite`, `Mesh`, `BitmapText`, `AudioSource`, `Camera`, `Interpolation`, `Shape` and
  `Behaviors` fill their fields with `@DefineField`. A key missing from the configuration
  now gets the field's initial value: `AudioSource` and `Camera` used to leave it
  `undefined`, and `Behaviors` used to throw on a missing `list`.
- When the editor opens a project, it fills in the missing fields of shader options in `Mesh`
  and of filter effect options in `Renderer`, as it already did for behavior options.
- The editor finds decorated classes among the exports of your script files, so a decorated
  class must be exported. Widgets no longer need to load before the classes they draw.
- Project code shares the editor's `dacha` and `pixi.js` instead of bundling second copies.
- The inspector opens what you add (a component, a system, a behavior, a list entry) and
  keeps existing entries closed. Custom widgets get this by wrapping their lists in the new
  `NewItemTracker`. It also remembers which components and systems you keep open, per type
  and across restarts, and hides a section while all of its fields are hidden.

### Fixed

- On Windows, the editor found no project scripts when `contextRoot`, `locales` or `events`
  in the editor configuration was an absolute path. The backslashes in the path were read as
  escape characters.
- `AddActorEvent` and `RemoveActorEvent` type `target` as the `ActorQuery` that dispatches
  them. They typed it as a `Scene` before, which never matched the object a listener got.
- An inspector section no longer closes when its title changes. Deleting an animation
  condition or a multi-field entry renumbered the ones below it and closed them.
- A field in a closed inspector section gets its initial value when its dependency shows
  it, and loses its value when the dependency hides it. Before, this only worked once the
  section had been opened.
