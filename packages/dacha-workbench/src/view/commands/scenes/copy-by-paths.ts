import { uuid } from '../../../utils/uuid';
import type { SceneConfig, ActorConfig } from 'dacha';

import type { ExplorerEntity } from '../../../types/explorer-entity';
import type {
  CommandContext,
  DispatchFn,
  GetStateFn,
} from '../../hooks/use-commander';
import { getUniqueName } from '../../../utils/get-unique-name';
import { addValues } from '..';
import { SCENE_PATH_LENGTH } from '../../../consts/paths';
import { remapReferences } from '../../../utils/remap-references';

type IdMap = Map<string, string>;

const updateIds = (actor: ActorConfig, idMap: IdMap): void => {
  const id = uuid();
  idMap.set(actor.id, id);
  actor.id = id;
  actor.children?.forEach((child) => updateIds(child, idMap));
};

const getActorDuplicate = (
  actor: unknown,
  parent: unknown,
  idMap: IdMap,
): ActorConfig => {
  const duplicate = structuredClone(actor as ActorConfig);
  duplicate.name = getUniqueName(duplicate.name, parent as ExplorerEntity[]);
  updateIds(duplicate, idMap);

  return duplicate;
};

const getSceneDuplicate = (
  scene: unknown,
  parent: unknown,
  idMap: IdMap,
): SceneConfig => {
  const duplicate = structuredClone(scene as SceneConfig);
  duplicate.name = getUniqueName(duplicate.name, parent as ExplorerEntity[]);
  const id = uuid();
  idMap.set(duplicate.id, id);
  duplicate.id = id;
  duplicate.actors.forEach((actor) => updateIds(actor, idMap));

  return duplicate;
};

const isPathCorrect = (
  path: string[],
  isActorDestination: boolean,
): boolean => {
  if (isActorDestination) {
    return path.length > SCENE_PATH_LENGTH;
  }
  return path.length === SCENE_PATH_LENGTH;
};

export const copyByPaths =
  (sourcePaths: string[][], destinationPath: string[]) =>
  (
    dispatch: DispatchFn,
    getState: GetStateFn,
    { walker }: CommandContext,
  ): void => {
    const isActorDestination = destinationPath.at(-1) !== 'scenes';
    const idMap: IdMap = new Map();
    const destination = getState(destinationPath);
    if (!Array.isArray(destination)) {
      return;
    }

    const { values } = sourcePaths.reduce(
      (acc, path) => {
        if (!isPathCorrect(path, isActorDestination)) {
          return acc;
        }
        const value = getState(path);
        if (value) {
          const duplicate = isActorDestination
            ? getActorDuplicate(value, acc.parent, idMap)
            : getSceneDuplicate(value, acc.parent, idMap);

          acc.values.push(duplicate);
          acc.parent.push(duplicate);
        }
        return acc;
      },
      { values: [] as unknown[], parent: destination.slice(0) },
    );

    if (values.length) {
      remapReferences(
        walker,
        {
          actors: isActorDestination
            ? (values as ActorConfig[])
            : (values as SceneConfig[]).flatMap((scene) => scene.actors),
        },
        idMap,
      );
      dispatch(addValues(destinationPath, values));
    }
  };
