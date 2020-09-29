class Script {
  constructor(gameObject, store, spawner, destroyer) {
    this.gameObject = gameObject;
    this.store = store;
    this.spawner = spawner;
    this.destroyer = destroyer;
  }

  update() {
    throw new Error('You should override this function');
  }
}

export default Script;
