import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import CollisionSolver from 'contrib/processors/collisionSolver/collisionSolver';

class CollisionSolverPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      gameObjectObserver,
      store,
    } = options;

    return new CollisionSolver({
      gameObjectObserver,
      store,
    });
  }
}

export default CollisionSolverPlugin;
