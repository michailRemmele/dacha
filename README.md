<p align="center">
  <img
    src="https://raw.githubusercontent.com/michailRemmele/dacha/master/packages/dacha-workbench/src/view/assets/logo.png"
    alt="dacha"
    width="128"
    height="128"
  />
</p>

<h1 align="center">dacha</h1>

<p align="center">
  A data-driven TypeScript game engine for the browser, with a visual editor.
</p>

<p align="center">
  <a href="https://dachajs.org/">Documentation</a> ·
  <a href="https://dachajs.org/getting-started/installation/">Get started</a> ·
  <a href="https://dachajs.org/api/">API reference</a> ·
  <a href="https://misharemmele.ru/">Dev blog</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/dacha"><img src="https://img.shields.io/npm/v/dacha?color=cb3837&label=dacha" alt="dacha on npm"></a>
  <a href="https://www.npmjs.com/package/dacha-workbench"><img src="https://img.shields.io/npm/v/dacha-workbench?color=cb3837&label=dacha-workbench" alt="dacha-workbench on npm"></a>
  <a href="https://github.com/michailRemmele/dacha/actions/workflows/ci.yml"><img src="https://github.com/michailRemmele/dacha/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/dacha" alt="MIT license"></a>
</p>

---

## Why dacha

- 📄 **The game is data, not code.** Game data is described as JSON configuration.
- 🧩 **ECS-inspired.** Actors are made of components. Systems hold the logic.
- 💻 **A visual editor.** Build scenes and watch the game run as you edit.
- 🔋 **Built-in systems.** Rendering, physics, animation, audio, input, camera and more.
- 🐙 **Fully open source.** The engine and editor are open source and free to use.

## Getting started

```bash
npm create dacha@latest my-game
cd my-game
npm install
npm run dev                  # run the game
npm run editor               # launch the editor
```

You get a running game — a sprite you move with WASD, a camera, an HTML overlay.

## Examples

- [Drillers' Escape](https://michailremmele.github.io/gmtk-jam-2026/) — GMTK 2026
  ([source](https://github.com/michailRemmele/gmtk-jam-2026))
- [Piranha Frenzy](https://ludum-dare-57.netlify.app/) — Ludum Dare 57
  ([source](https://github.com/michailRemmele/ludum-dare-57))

## Packages

- [`dacha`](packages/dacha) — the engine
- [`dacha-workbench`](packages/dacha-workbench) — the visual editor
- [`create-dacha`](packages/create-dacha) — the project scaffolder

## Contributing

Bug reports and ideas are welcome in
[issues](https://github.com/michailRemmele/dacha/issues). For anything larger than a fix,
open an issue first so we can agree on the direction before you write code.

## License

[MIT](LICENSE) © Mikhail Remmele
