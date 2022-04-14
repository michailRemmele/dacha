import { SystemPlugin, SystemPluginOptions } from '../../../engine/system';
import { CollisionSolver } from '../../systems/collision-solver';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';

export class CollisionSolverPlugin implements SystemPlugin {
  load(options: SystemPluginOptions) {
    const {
      createGameObjectObserver,
      store,
      messageBus,
    } = options;

    return new CollisionSolver({
      gameObjectObserver: createGameObjectObserver({
        components: [
          RIGID_BODY_COMPONENT_NAME,
        ],
      }),
      store,
      messageBus,
    });
  }
}
