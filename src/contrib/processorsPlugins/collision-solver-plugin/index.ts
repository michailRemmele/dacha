import { ProcessorPlugin, ProcessorPluginOptions } from '../../../engine/processor';
import CollisionSolver from '../../processors/collisionSolver/collisionSolver';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';

export class CollisionSolverPlugin implements ProcessorPlugin {
  load(options: ProcessorPluginOptions) {
    const {
      createGameObjectObserver,
      store,
    } = options;

    return new CollisionSolver({
      gameObjectObserver: createGameObjectObserver({
        components: [
          RIGID_BODY_COMPONENT_NAME,
        ],
      }),
      store,
    });
  }
}
