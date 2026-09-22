import type { ActorCreator } from './actor-creator';
import type { Actor } from './actor';

/**
 * Creates actors from templates at runtime.
 *
 * Systems get it in `options.actorSpawner`, behaviors in their options too.
 *
 * @example
 * ```ts
 * const bullet = this.actorSpawner.spawn(BULLET_TEMPLATE_ID);
 * scene.appendChild(bullet);
 * ```
 *
 * @see [Creating and destroying actors](https://dachajs.org/concepts/actors/#creating-and-destroying-actors)
 *
 * @category Actors & Components
 */
export class ActorSpawner {
  private actorCreator: ActorCreator;

  /** @internal */
  constructor(actorCreator: ActorCreator) {
    this.actorCreator = actorCreator;
  }

  /**
   * Creates an actor from a template, with the child actors of the template.
   *
   * The new actor does not belong to any scene. Append it to a scene or to
   * another actor to add it to the game.
   *
   * @param templateId - The id of the template.
   * @returns The new actor.
   * @throws Error If there is no template with this id.
   */
  spawn(templateId: string): Actor {
    return this.actorCreator.create({
      templateId,
      isNew: true,
    });
  }
}
