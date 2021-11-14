import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import ConstraintSolver from '../../processors/constraintSolver/constraintSolver';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const TRANSFORM_COMPONENT_NAME = 'transform';

export class ConstraintSolverPlugin implements ProcessorPlugin {
  load(options: ProcessorPluginOptions) {
    return new ConstraintSolver({
      gameObjectObserver: options.createGameObjectObserver({
        components: [
          RIGID_BODY_COMPONENT_NAME,
          TRANSFORM_COMPONENT_NAME,
        ],
      }),
    });
  }
}
