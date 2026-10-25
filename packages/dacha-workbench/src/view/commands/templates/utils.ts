import type { TemplateConfig, ActorConfig, SceneConfig } from 'dacha';

import { buildActorConfig } from '../../../utils/build-actor-config';

const isMadeFrom = (actor: ActorConfig, templateIds: Set<string>): boolean =>
  !!actor.templateId && templateIds.has(actor.templateId);

/**
 * Adds actors made from `templates` to every actor made from the template `parentId`.
 */
export const addChildActors = (
  scenes: SceneConfig[],
  parentId: string,
  templates: TemplateConfig[],
): SceneConfig[] => {
  const update = (actors: ActorConfig[]): ActorConfig[] =>
    actors.map((actor) => ({
      ...actor,
      children:
        actor.templateId === parentId
          ? [
              ...update(actor.children ?? []),
              ...templates.map(buildActorConfig),
            ]
          : actor.children && update(actor.children),
    }));

  return scenes.map((scene) => ({ ...scene, actors: update(scene.actors) }));
};

/**
 * Removes the actors made from `templateIds` that are children of actors made from the
 * template `parentId`.
 */
export const removeChildActors = (
  scenes: SceneConfig[],
  parentId: string,
  templateIds: Set<string>,
): SceneConfig[] => {
  const update = (actors: ActorConfig[]): ActorConfig[] =>
    actors.map((actor) => {
      const children =
        actor.templateId === parentId
          ? actor.children?.filter((child) => !isMadeFrom(child, templateIds))
          : actor.children;

      return { ...actor, children: children && update(children) };
    });

  return scenes.map((scene) => ({ ...scene, actors: update(scene.actors) }));
};

/** Removes every actor made from `templateIds`, with its children. */
export const removeActors = (
  scenes: SceneConfig[],
  templateIds: Set<string>,
): SceneConfig[] => {
  const update = (actors: ActorConfig[]): ActorConfig[] =>
    actors
      .filter((actor) => !isMadeFrom(actor, templateIds))
      .map((actor) => ({
        ...actor,
        children: actor.children && update(actor.children),
      }));

  return scenes.map((scene) => ({ ...scene, actors: update(scene.actors) }));
};
