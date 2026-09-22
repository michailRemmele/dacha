<p align="center">
  <img src="https://raw.githubusercontent.com/michailRemmele/dacha/master/packages/dacha-workbench/src/view/assets/logo.png" alt="dacha" width="96" height="96" />
</p>

<h1 align="center">dacha API reference</h1>

<p align="center">
  A data-driven TypeScript game engine for the browser.
</p>

<p align="center">
  <a href="https://dachajs.org/">Documentation</a> ·
  <a href="https://dachajs.org/getting-started/installation/">Get started</a> ·
  <a href="https://github.com/michailRemmele/dacha">GitHub</a>
</p>

---

This reference lists every class, function and type that the `dacha` package exports.

It is the companion to the [documentation](https://dachajs.org/). The documentation explains
how the engine works and how to build a game with it. This reference answers the narrower
questions: what a method takes, what a property holds, what a type contains.

## Import paths

The package has four import paths. This reference shows all of them in one tree.

| Import path      | What it contains                                           |
| ---------------- | ---------------------------------------------------------- |
| `dacha`          | The engine, actors, systems, components, assets and math   |
| `dacha/events`   | Event names and event types                                |
| `dacha/renderer` | Types for the renderer: shaders, filter effects, sorting   |
| `dacha/physics`  | Types for physics: system options, layers and query params |

`dacha/renderer` and `dacha/physics` contain types only. Import them with `import type`.

## Sections

The sidebar groups the API the same way the documentation does. Each section below links to
the documentation page that explains it.

| Section              | Documentation                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Engine               | [Configuration](https://dachajs.org/concepts/configuration/), [Game loop](https://dachajs.org/concepts/game-loop/) |
| Actors & Components  | [ECS](https://dachajs.org/concepts/ecs/), [Actors](https://dachajs.org/concepts/actors/)                           |
| Scenes & World       | [Scenes and world](https://dachajs.org/concepts/scenes-and-world/)                                                 |
| Events               | [Events](https://dachajs.org/concepts/events/)                                                                     |
| Systems              | [Systems](https://dachajs.org/concepts/systems/)                                                                   |
| Math                 | —                                                                                                                  |
| Assets               | [Configuration](https://dachajs.org/concepts/configuration/)                                                       |
| Behaviors            | [Behaviors](https://dachajs.org/systems/behaviors/)                                                                |
| Rendering            | [Rendering](https://dachajs.org/systems/rendering/)                                                                |
| Physics              | [Physics](https://dachajs.org/systems/physics/)                                                                    |
| Character Controller | [Character controller](https://dachajs.org/systems/character-controller/)                                          |
| Interpolation        | [Interpolation](https://dachajs.org/systems/interpolation/)                                                        |
| Animation            | [Animation](https://dachajs.org/systems/animation/)                                                                |
| Audio                | [Audio](https://dachajs.org/systems/audio/)                                                                        |
| Input                | [Input](https://dachajs.org/systems/input/)                                                                        |
| Camera               | [Camera](https://dachajs.org/systems/camera/)                                                                      |
| Game UI              | [Game UI](https://dachajs.org/systems/game-ui/)                                                                    |
| Game Stats           | [Performance](https://dachajs.org/production/performance/)                                                         |

A section for a built-in system holds everything that belongs to it. That is the system, its
API, its components, their config types and the events it sends.
