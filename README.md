# dacha

A web game engine for the browser, and the GUI editor built for it.

| Package                                       | What it is                                                                                                                                                                                             |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`dacha`](packages/dacha)                     | The engine. Data-driven and ECS-flavored: a game is a config of scenes, actors, templates and systems. Rendering on [pixi.js](https://pixijs.com/), with physics, animation, audio and input included. |
| [`dacha-workbench`](packages/dacha-workbench) | The editor. An Electron + React desktop app for building scenes, editing actors and templates, and running the game as you edit it.                                                                    |
| [`create-dacha`](packages/create-dacha)       | The scaffolder. `npm create dacha@latest my-game` writes a complete, running project and exits.                                                                                                        |

- **[API docs](https://michailremmele.github.io/dacha/)**
- **[Dev blog](https://misharemmele.ru/)** — where I write about how this engine is being built.

## Getting started

```bash
npm create dacha@latest my-game
cd my-game
npm install
npm run dev                  # run the game
npm run editor               # launch the editor against it
```

You get a running game — a sprite you move with WASD, a camera, an HTML overlay — with
four dependencies and no trace of the scaffolder left behind. To add dacha to a project you
already have, install `dacha` and `dacha-workbench` and write a
`dacha-workbench.config.cjs`; the editor reads it from the project root.

## Examples

- [Drillers' Escape](https://michailremmele.github.io/gmtk-jam-2026/)
- [Piranha Frenzy](https://ludum-dare-57.netlify.app/)

## Working on the engine

This repository is an npm workspaces monorepo — both packages are developed and released
together, from the root:

```bash
npm i
npm run dev          # engine watcher + editor, changes flow through without a rebuild
npm test             # both packages
npm run lint         # whole repo
npm run build        # both packages, plus the editor app bundle
```

See [AGENTS.md](AGENTS.md) for the architecture of each package and the conventions this
repository follows.

## License

MIT
