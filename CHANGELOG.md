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
- `dacha` exports the decorators `DefineComponent`, `DefineSystem`, `DefineAsset`,
  `DefineBehavior`, `DefineShader`, `DefineFilterEffect` and `DefineField`, plus `getSchema`
  and the field types (`Field`, `FieldType` and the others). They are standard (TC39)
  decorators and need no TypeScript flags.
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

- `Sprite`, `Mesh`, `BitmapText`, `AudioSource`, `Camera`, `Interpolation`, `Shape` and
  `Behaviors` fill their fields with `@DefineField` instead of a constructor. A key missing
  from the configuration now gets the field's initial value: `AudioSource` and `Camera`
  used to leave it `undefined`, and `Behaviors` used to throw on a missing `list`. The
  initial `color` of `Sprite` and `Mesh`, and the initial `fill` and `strokeColor` of
  `Shape`, are written as `'#ffffff'` instead of `'#fff'`.

- **Breaking:** the decorators moved from `dacha-workbench/decorators` to `dacha`, and that
  subpath is gone. Import them from `dacha`, and remove `experimentalDecorators` and
  `emitDecoratorMetadata` from `tsconfig.json`. `reflect-metadata` is no longer needed.
- **Breaking:** some field types have new names: `Option` is `FieldOption`, `Dependency` is
  `FieldDependency`, `DependencyValue` is `FieldDependencyValue`, `GetOptionsFn` is
  `GetFieldOptionsFn`, `SectionSettings` is `SchemaSection` and `WidgetOptions` is
  `SchemaOptions`.
- **Breaking:** `dacha-workbench` no longer exports the field types (`WidgetField`,
  `FieldType`, `Dependency`, `DependencyValue`). Import `Field` and the others from `dacha`.
- **Breaking:** shaders and filter effects have their own static name. `Shader.behaviorName` is
  now `Shader.shaderName`, and `FilterEffect.behaviorName` is now
  `FilterEffect.filterEffectName`. `DefineShader` and `DefineFilterEffect` set it.
- **Breaking:** the editor configuration has separate `shaders` and `filterEffects` settings.
  `behaviors` now matches only `*.behavior.ts` by default.
- **Breaking:** `useBehaviors` in `dacha-workbench` is replaced by `useSchemas(kind)`, and
  `BehaviorWidget` is removed. The inspector draws the options of behaviors, shaders and
  filter effects itself.
- `Mesh.material` is a declared inspector field. The behaviors list, the mesh material and
  the renderer filter effects share one inspector widget.
- When the editor opens a project, it fills in the missing fields of shader options in `Mesh`
  and of filter effect options in `Renderer`, as it already did for behavior options.
- The built-in components, systems and assets describe their inspector fields with the same
  decorators, instead of the editor keeping a separate copy.
- The editor finds decorated classes among the exports of your script files, so a decorated
  class must be exported. Widgets no longer need to load before the classes they draw.
- Project code shares the editor's `dacha` and `pixi.js` instead of bundling second copies.
- **Breaking:** `dacha-workbench` has a peer dependency on `dacha` of the same version. The
  editor runs project code with its own engine, so npm now refuses to install the two
  packages at different versions.
- The event types in `dacha/events` (`LoadSceneEvent`, `CollisionEnterEvent`,
  `KeyboardInputEvent` and the others) are interfaces instead of type aliases. They have the
  same fields, so code that uses them does not change.
- **Breaking:** the `subtract` blending mode was misspelled `substract`. The view
  components (`Sprite`, `Shape`, `BitmapText`, `Mesh`) and the editor now use `subtract`.
  A configuration that still says `"blending": "substract"` needs the new spelling.
- The inspector opens what you add: a component, a system, a behavior, a filter effect, an
  animation condition, an input binding, an audio group or a multi-field entry. Entries that
  were already there stay closed. Custom widgets get the same behavior by wrapping their
  lists in the new `NewItemTracker` from `dacha-workbench`.
- The inspector remembers which components and systems you keep open. The state belongs to
  the type, not to one actor: open `Sprite` once and it is open on every actor and template.
  It is saved with the rest of the editor state in `.dacha/cache.json` and survives a restart.
- The inspector hides a section while all of its fields are hidden by their dependencies.
- **Breaking:** `Section` from `dacha-workbench` no longer takes an `id`. A section keeps its
  state when its title changes without one.
- The shader picker in the `Mesh` material section is labelled "Shader" instead of repeating
  "Material".

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
