import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { ConstraintSolver } from '../../systems/constraint-solver';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const TRANSFORM_COMPONENT_NAME = 'transform';

export class ConstraintSolverPlugin implements SystemPlugin {
  load(options: SystemPluginOptions) {
    return new ConstraintSolver({
      gameObjectObserver: options.createGameObjectObserver({
        components: [
          RIGID_BODY_COMPONENT_NAME,
          TRANSFORM_COMPONENT_NAME,
        ],
      }),
      messageBus: options.messageBus,
    });
  }
}
