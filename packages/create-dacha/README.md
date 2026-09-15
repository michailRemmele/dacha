# create-dacha

Scaffold a [dacha](https://github.com/michailRemmele/dacha) game project.

```bash
npm create dacha@latest my-game
yarn create dacha my-game
pnpm create dacha my-game
bun create dacha my-game
```

Then:

```bash
cd my-game
npm install
npm run dev
```

You get a Vite project with a playable top-down scene: a sprite you move with
WASD, a camera, and an overlay with a restart button. The engine and the editor
are already wired up — `npm run editor` opens the editor against the generated
`data/data.json`.

The generated project has four dependencies and no trace of this package: it
copies a template and exits.
