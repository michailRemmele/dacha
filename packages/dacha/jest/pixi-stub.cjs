// pixi.js ships ESM that Jest cannot run, so every test gets this stub in its
// place: each export is an empty class. A test that needs pixi.js behaviour
// mocks the exports it uses with jest.mock('pixi.js', factory).
module.exports = new Proxy(
  {},
  {
    get: (_target, key) => (key === '__esModule' ? false : class {}),
  },
);
