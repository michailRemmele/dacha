import { SceneSystem, ActorQuery, Transform } from 'dacha';
import type { Scene, SceneSystemOptions, Time } from 'dacha';
import { DefineSystem } from 'dacha-workbench/decorators';

import { Move } from '../../events';
import type { MoveEvent } from '../../events';
import Movement from '../components/movement.component';

@DefineSystem({
  name: 'MovementSystem',
})
export default class MovementSystem extends SceneSystem {
  private scene: Scene;
  private time: Time;
  private actorQuery: ActorQuery;

  constructor(options: SceneSystemOptions) {
    super();

    this.scene = options.scene;
    this.time = options.time;
    this.actorQuery = new ActorQuery({
      scene: options.scene,
      filter: [Transform, Movement],
    });

    this.scene.addEventListener(Move, this.handleMove);
  }

  onSceneDestroy(): void {
    this.scene.removeEventListener(Move, this.handleMove);
  }

  private handleMove = (event: MoveEvent): void => {
    const movement = event.target.getComponent(Movement);
    if (!movement) {
      return;
    }

    movement.directionX += event.x;
    movement.directionY += event.y;
  };

  update(): void {
    const { deltaTime } = this.time;

    this.actorQuery.getActors().forEach((actor) => {
      const movement = actor.getComponent(Movement);
      const transform = actor.getComponent(Transform);

      const length = Math.hypot(movement.directionX, movement.directionY);

      movement.isMoving = length > 0;

      if (movement.isMoving) {
        const distance = movement.speed * deltaTime;

        transform.local.position.x += (movement.directionX / length) * distance;
        transform.local.position.y += (movement.directionY / length) * distance;
      }

      movement.directionX = 0;
      movement.directionY = 0;
    });
  }
}
