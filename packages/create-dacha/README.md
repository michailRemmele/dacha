<p align="center">
  <img
    src="https://raw.githubusercontent.com/michailRemmele/dacha/master/packages/dacha-workbench/src/view/assets/logo.png"
    alt="dacha"
    width="96"
    height="96"
  />
</p>

<h1 align="center">create-dacha</h1>

<p align="center">
  Scaffold a project for the <a href="https://www.npmjs.com/package/dacha">dacha</a> game engine.
</p>

<p align="center">
  <a href="https://dachajs.org/getting-started/installation/">Documentation</a> ·
  <a href="https://github.com/michailRemmele/dacha">GitHub</a>
</p>

---

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

You get a Vite project with a playable top-down scene: a sprite you move with WASD, a
camera, and an overlay with a restart button. The engine and the editor are already wired
up — `npm run editor` opens the editor against the generated `data/data.json`.

## License

[MIT](LICENSE) © Mikhail Remmele
