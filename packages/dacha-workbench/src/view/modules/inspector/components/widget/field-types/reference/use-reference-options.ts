import { useMemo } from 'react';
import type {
  ActorConfig,
  AssetConfig,
  SceneConfig,
  TemplateConfig,
} from 'dacha';

import { useConfig } from '../../../../../../hooks';
import type { SelectOption } from '../../../../../../../types/inputs';

import { getSceneIdByPath } from '../../../../../../../utils/get-scene-id-by-path';

export interface ReferenceOptions {
  options: SelectOption[];
  /** `false` when the field has nothing to offer here */
  available: boolean;
}

const ACTOR_PATH_SEPARATOR = ' / ';

const toOption = ({
  id,
  name,
}: {
  id: string;
  name: string;
}): SelectOption => ({
  title: name,
  value: id,
});

const collectActors = (
  actors: ActorConfig[],
  parentTitle: string | undefined,
  options: SelectOption[],
): SelectOption[] => {
  actors.forEach((actor) => {
    const title = parentTitle
      ? `${parentTitle}${ACTOR_PATH_SEPARATOR}${actor.name}`
      : actor.name;
    options.push({ title, value: actor.id });
    collectActors(actor.children ?? [], title, options);
  });
  return options;
};

const NOT_AVAILABLE: ReferenceOptions = { options: [], available: false };

export const useAssetOptions = (kind: string | undefined): ReferenceOptions => {
  const assets = useConfig(['assets']) as AssetConfig[] | undefined;
  return useMemo(
    () => ({
      available: true,
      options: (assets ?? [])
        .filter((asset) => asset.kind === kind)
        .map(toOption),
    }),
    [assets, kind],
  );
};

export const useTemplateOptions = (): ReferenceOptions => {
  const templates = useConfig(['templates']) as TemplateConfig[] | undefined;
  return useMemo(
    () => ({ available: true, options: (templates ?? []).map(toOption) }),
    [templates],
  );
};

export const useSceneOptions = (): ReferenceOptions => {
  const scenes = useConfig(['scenes']) as SceneConfig[] | undefined;
  return useMemo(
    () => ({ available: true, options: (scenes ?? []).map(toOption) }),
    [scenes],
  );
};

export const useActorOptions = (fieldPath: string[]): ReferenceOptions => {
  const sceneId = getSceneIdByPath(fieldPath);
  const path = useMemo(
    () => (sceneId ? ['scenes', `id:${sceneId}`, 'actors'] : undefined),
    [sceneId],
  );
  const actors = useConfig(path) as ActorConfig[] | undefined;

  return useMemo(
    () =>
      path
        ? {
            available: true,
            options: collectActors(actors ?? [], undefined, []),
          }
        : NOT_AVAILABLE,
    [path, actors],
  );
};
