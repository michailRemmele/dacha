import { uuid } from '../../../utils/uuid';
import type { TemplateConfig, SceneConfig } from 'dacha';

import type { ExplorerEntity } from '../../../types/explorer-entity';
import type {
  CommandContext,
  DispatchFn,
  GetStateFn,
} from '../../hooks/use-commander';
import { getUniqueName } from '../../../utils/get-unique-name';
import { getIdByPath } from '../../../utils/get-id-by-path';
import { addValues, setValue } from '..';

import { remapReferences } from '../../../utils/remap-references';

import { addChildActors } from './utils';

type IdMap = Map<string, string>;

const updateIds = (template: TemplateConfig, idMap: IdMap): void => {
  const id = uuid();
  idMap.set(template.id, id);
  template.id = id;
  template.children?.forEach((child) => updateIds(child, idMap));
};

const getDuplicate = (
  template: TemplateConfig,
  parent: TemplateConfig[],
  idMap: IdMap,
): TemplateConfig => {
  const duplicate = structuredClone(template);
  duplicate.name = getUniqueName(duplicate.name, parent as ExplorerEntity[]);
  updateIds(duplicate, idMap);

  return duplicate;
};

export const copyByPaths =
  (sourcePaths: string[][], destinationPath: string[]) =>
  (
    dispatch: DispatchFn,
    getState: GetStateFn,
    { walker }: CommandContext,
  ): void => {
    const destination = getState(destinationPath);
    if (!Array.isArray(destination)) {
      return;
    }
    const idMap: IdMap = new Map();

    const { values } = sourcePaths.reduce(
      (acc, path) => {
        const value = getState(path);
        if (value) {
          const duplicate = getDuplicate(
            value as TemplateConfig,
            acc.parent,
            idMap,
          );

          acc.values.push(duplicate);
          acc.parent.push(duplicate);
        }
        return acc;
      },
      {
        values: [] as TemplateConfig[],
        parent: destination.slice(0) as TemplateConfig[],
      },
    );

    if (!values.length) {
      return;
    }

    remapReferences(walker, { templates: values }, idMap);

    dispatch(addValues(destinationPath, values));
    if (destinationPath.at(-1) === 'children') {
      const parentTemplateId = getIdByPath(destinationPath.slice(0, -1));
      const scenes = getState(['scenes']) as SceneConfig[];
      dispatch(
        setValue(
          ['scenes'],
          addChildActors(scenes, parentTemplateId, values),
          true,
        ),
      );
    }
  };
