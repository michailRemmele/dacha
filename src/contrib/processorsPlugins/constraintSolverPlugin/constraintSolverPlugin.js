import ProcessorPlugin from '../../../engine/processorPlugin/processorPlugin';
import ConstraintSolver from '../../processors/constraintSolver/constraintSolver';

class ConstraintSolverPlugin extends ProcessorPlugin {
  async load(options) {
    const { gameObjectObserver } = options;

    return new ConstraintSolver({
      gameObjectObserver,
    });
  }
}

export default ConstraintSolverPlugin;
