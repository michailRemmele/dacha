# my-game

A [dacha](https://github.com/michailRemmele/dacha) game, generated with
`npm create dacha`.

## Running it

```bash
npm install
npm run dev
```

WASD moves the player. The Restart button reloads the scene.

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run editor` | Open the dacha editor against this project |
| `npm run typecheck` | `tsc --noEmit` |

## Layout

```
data/
  data.json      the game: scenes, actors, systems. Edit with `npm run editor`
  assets/        textures, audio, fonts — also Vite's publicDir
src/
  index.ts       collects your classes and starts the engine
  events/        your event types
  game/          your components and systems
  ui/            the HTML overlay
```

`data/data.json` is written by the editor. Editing it by hand works but the
editor will rewrite it in its own format on the next save.

## Adding your own code

Name the file after what it declares and give it a default export:

| Suffix | Declares |
| --- | --- |
| `*.component.ts` | A component |
| `*.system.ts` | A system |
| `*.behavior.ts` | A behavior |

`src/index.ts` globs for these, so a new file is picked up by the game with no
wiring. The decorators from `dacha-workbench/decorators` register the same class
with the editor, so its fields become editable in the inspector. The editor can
generate these files for you.

Two things that are easy to get wrong:

- **A system only runs if it is listed in `systems` in `data/data.json`.** Being
  picked up by the glob makes it *available*, not active.
- **Order in that array matters.** A system whose constructor reads another
  system's API must come after it — `CameraSystem` before `Renderer`, for
  instance.

## Learn more

- [Documentation](https://github.com/michailRemmele/dacha)
