---
title: "Building & deploying"
description: "Produce a distributable build and put it online."
---

Dacha does not provide a build system. Use any bundler that fits your project. Dacha is included as
a dependency like any other.

A built game is a set of static files: an HTML page, a JavaScript bundle, and the asset files. Any
server that serves static files can host it.

The [starter project](/getting-started/installation/) comes with Vite and builds with
`npm run build`. If you use another bundler, or write your own configuration, this page lists
what that configuration has to do.

## Get the configuration to the engine

`new Engine({ config })` takes the game configuration as a plain object. Where the object
comes from is your choice.

The simplest way is to import the JSON file, so that the bundler puts it in the bundle:

```ts
import config from '../data/data.json';
```

This needs JSON imports, which means `resolveJsonModule` in `tsconfig.json` and support in the
bundler. Most bundlers handle JSON out of the box.

The other way is to fetch the file at runtime and start the engine once it arrives. The
configuration then stays a separate file, and you can replace it without rebuilding the game.

## Keep the asset paths intact

Every asset in the configuration stores the path to its file, such as `player.png`. The engine
loads that path exactly as written, relative to the URL of the page. The build must therefore
copy the asset files into the output next to the page, with the same names.

Bundlers usually call this a static or public directory. In the starter project it is Vite's
`publicDir`, pointed at `data/assets`. Whatever you use, keep those files out of the hashing
and inlining that the bundler applies to code.

## Compile the decorators

`DefineComponent`, `DefineSystem` and `DefineBehavior` set the static name that the engine
looks for. A class that reaches the engine without its name stops the
game at startup.

These are TypeScript's legacy decorators. The compiler options the starter project uses are a
working baseline:

```json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true,
  "useDefineForClassFields": false
}
```

## Register your classes explicitly

The engine takes arrays of classes. The starter project fills those arrays with
`import.meta.glob`, which is a Vite feature. With another bundler, use its equivalent or
import the classes by hand. See [how scripts are found](/game-code/auto-registration/).

## Expect ES modules

Dacha is published as ES modules, compiled to modern JavaScript. A bundler reads that
without any extra setup.

If you support older browsers, transpile the engine together with your own code. Many setups
skip `node_modules` by default, and then the modern syntax reaches the browser untouched.
