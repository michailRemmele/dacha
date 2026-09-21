<p align="center">
  <img
    src="https://raw.githubusercontent.com/michailRemmele/dacha/master/packages/dacha-workbench/src/view/assets/logo.png"
    alt="dacha"
    width="96"
    height="96"
  />
</p>

<h1 align="center">dacha</h1>

<p align="center">
  A data-driven TypeScript game engine for the browser.
</p>

<p align="center">
  <a href="https://dachajs.org/">Documentation</a> ·
  <a href="https://dachajs.org/api/">API reference</a> ·
  <a href="https://github.com/michailRemmele/dacha">GitHub</a>
</p>

---

Dacha is a game engine with a core runtime and built-in components and systems. A game combines the
engine with its JSON configuration and custom game logic.

Actors are composed of components that hold data, while systems contain the logic that acts on them.
Scenes, actors, templates and systems can be described in JSON and assembled into a running world by
the engine.

Rendering, physics, animation, audio, input and camera systems ship with the engine.

The fastest way to start is the scaffolder — it writes a complete, running project:

```bash
npm create dacha@latest my-game
```

To add the engine to a project you already have:

```bash
npm install dacha
```

```ts
import {
  Engine,
  Renderer,
  CameraSystem,
  Transform,
  Sprite,
  Texture,
} from 'dacha';

// the game data, built in the editor and saved as JSON
import config from '../data/data.json';

const engine = new Engine({
  config,
  systems: [Renderer, CameraSystem],
  components: [Transform, Sprite],
  assets: [Texture],
});

void engine.play();
```

That is the whole entry point. `config` describes the game, and you can build it in
[dacha-workbench](https://www.npmjs.com/package/dacha-workbench), the visual editor.
See [Getting started](https://dachajs.org/getting-started/installation/) for the full
setup.

## License

[MIT](LICENSE) © Mikhail Remmele
