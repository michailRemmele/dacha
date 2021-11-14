const SCRIPT_COMPONENT_NAME = 'script';

class ScriptProcessor {
  constructor(options) {
    const {
      gameObjectObserver,
      gameObjectSpawner,
      gameObjectDestroyer,
      store,
      scripts,
    } = options;

    this._gameObjectObserver = gameObjectObserver;
    this._gameObjectSpawner = gameObjectSpawner;
    this._gameObjectDestroyer = gameObjectDestroyer;
    this._store = store;
    this._scripts = scripts;

    this._activeScripts = {};
  }

  _processRemovedGameObjects() {
    this._gameObjectObserver.getLastRemoved().forEach((gameObject) => {
      const id = gameObject.getId();
      this._activeScripts[id] = null;
    });
  }

  process(options) {
    const { messageBus, deltaTime } = options;

    this._processRemovedGameObjects();

    this._gameObjectObserver.forEach((gameObject) => {
      const id = gameObject.getId();
      const { name } = gameObject.getComponent(SCRIPT_COMPONENT_NAME);

      const Script = this._scripts[name];

      this._activeScripts[id] = this._activeScripts[id]
        || new Script(gameObject, this._store, this._gameObjectSpawner, this._gameObjectDestroyer);

      this._activeScripts[id].update(messageBus, deltaTime);
    });
  }
}

export default ScriptProcessor;
