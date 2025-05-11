import type {
  SceneConfig,
  ActorConfig,
} from 'dacha'

import { setValue, deleteByPaths } from '..'
import { getIdByPath } from '../../../utils/get-id-by-path'
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander'

const filterActors = (
  actors: ActorConfig[],
  templateIds: Set<string>,
): ActorConfig[] => actors.reduce((acc, actor) => {
  if (actor.templateId && templateIds.has(actor.templateId)) {
    return acc
  }

  acc.push({
    ...actor,
    children: actor.children && filterActors(actor.children, templateIds),
  })

  return acc
}, [] as ActorConfig[])

const filterScenes = (
  scenes: SceneConfig[],
  templateIds: Set<string>,
): SceneConfig[] => scenes.map((scene) => ({
  ...scene,
  actors: filterActors(scene.actors, templateIds),
}))

export const deleteTemplates = (
  paths: string[][],
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const templateIds = new Set(paths.map((path) => getIdByPath(path)))
  const scenes = getState(['scenes']) as SceneConfig[]

  dispatch(setValue(['scenes'], filterScenes(scenes, templateIds)))
  dispatch(deleteByPaths(paths, true))
}
