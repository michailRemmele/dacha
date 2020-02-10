import ProcessorPlugin from 'engine/processorPlugin/processorPlugin';

import CollisionSolver from 'contrib/processors/collisionSolver/collisionSolver';

class CollisionSolverPlugin extends ProcessorPlugin {
  async load(options) {
    const { gameObjectObserver } = options;

    return new CollisionSolver({
      gameObjectObserver,
    });
  }
}

export default CollisionSolverPlugin;
