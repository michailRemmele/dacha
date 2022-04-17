import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { CollisionSolver } from '../../systems/collision-solver';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';

export class CollisionSolverPlugin implements SystemPlugin {
  load(options: SystemPluginOptions) {
    const {
      createEntityObserver,
      store,
      messageBus,
    } = options;

    return new CollisionSolver({
      entityObserver: createEntityObserver({
        components: [
          RIGID_BODY_COMPONENT_NAME,
        ],
      }),
      store,
      messageBus,
    });
  }
}
