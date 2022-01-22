const SCRIPT_COMPONENT_NAME = 'script';

class ScriptProcessor {
  constructor(options) {
    const {
      gameObjectObserver,
      gameObjectSpawner,
      gameObjectDestroyer,
      store,
      scripts,
      messageBus,
    } = options;

    this._gameObjectObserver = gameObjectObserver;
    this._gameObjectSpawner = gameObjectSpawner;
    this._gameObjectDestroyer = gameObjectDestroyer;
    this._store = store;
    this._scripts = scripts;
    this.messageBus = messageBus;

    this._activeScripts = {};
  }

  processorDidMount() {
    this._gameObjectObserver.subscribe('onremove', this._handleGameObjectRemove);
  }

  processorWillUnmount() {
    this._gameObjectObserver.unsubscribe('onremove', this._handleGameObjectRemove);
  }

  _handleGameObjectRemove = (gameObject) => {
    this._activeScripts[gameObject.getId()] = null;
  };

  process(options) {
    const { deltaTime } = options;

    this._gameObjectObserver.fireEvents();

    this._gameObjectObserver.forEach((gameObject) => {
      const id = gameObject.getId();
      const { name } = gameObject.getComponent(SCRIPT_COMPONENT_NAME);

      const Script = this._scripts[name];

      this._activeScripts[id] = this._activeScripts[id]
        || new Script(gameObject, this._store, this._gameObjectSpawner, this._gameObjectDestroyer);

      this._activeScripts[id].update(this.messageBus, deltaTime);
    });
  }
}

export default ScriptProcessor;
