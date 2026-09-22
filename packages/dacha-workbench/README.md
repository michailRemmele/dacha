<p align="center">
  <img
    src="https://raw.githubusercontent.com/michailRemmele/dacha/master/packages/dacha-workbench/src/view/assets/logo.png"
    alt="dacha"
    width="96"
    height="96"
  />
</p>

<h1 align="center">dacha-workbench</h1>

<p align="center">
  The visual editor for the <a href="https://www.npmjs.com/package/dacha">dacha</a> game engine.
</p>

<p align="center">
  <a href="https://dachajs.org/editor/interface-tour/">Documentation</a> ·
  <a href="https://github.com/michailRemmele/dacha">GitHub</a>
</p>

---

<p align="center">
  <img
    src="https://raw.githubusercontent.com/michailRemmele/dacha/master/packages/dacha-docs/src/assets/editor/editor-overview.png"
    alt="The dacha-workbench window: scene explorer, viewport and inspector"
    width="960"
  />
</p>

A desktop app for building scenes, editing actors and templates, and configuring systems.
The viewport draws your scenes with the engine itself, so you see every change as you make
it. The editor reads and writes the same JSON configuration the engine runs.

The fastest way to start is the scaffolder — it wires the editor up for you:

```bash
npm create dacha@latest my-game
```

To add the editor to a project you already have:

```bash
npm install --save-dev dacha-workbench
```

The editor is an Electron app and runs on macOS, Windows and Linux. Installing it builds
that app, so the first install takes a while.

Write a `dacha-workbench.config.cjs` in the project root, then launch the editor:

```bash
npx dacha-workbench
```

## License

[MIT](LICENSE) © Mikhail Remmele
