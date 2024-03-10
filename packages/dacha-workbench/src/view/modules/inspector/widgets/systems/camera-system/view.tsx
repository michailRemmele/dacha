import { useMemo, FC } from 'react'
import type { SceneConfig, LevelConfig, ActorConfig } from 'remiz'

import type { References, WidgetProps } from '../../../../../../types/widget-schema'
import { Widget } from '../../../components/widget'
import { useConfig } from '../../../../../hooks'

const SCENE_PATH_LENGTH = 2

const getItems = (
  actors: Array<ActorConfig>,
  parent?: ActorConfig,
): Array<{ title: string, value: string }> => actors.reduce((acc, actor) => {
  acc.push({
    title: parent ? `${parent.name}.${actor.name}` : actor.name,
    value: actor.id,
  })

  if (actor.children?.length) {
    acc.push(...getItems(actor.children, actor))
  }

  return acc
}, [] as Array<{ title: string, value: string }>)

export const CameraSystemWidget: FC<WidgetProps> = ({ fields, path, references }) => {
  const scene = useConfig(path.slice(0, SCENE_PATH_LENGTH)) as SceneConfig
  const level = useConfig(typeof scene.levelId === 'string' ? ['levels', `id:${scene.levelId}`] : void 0) as LevelConfig
  const actors = level?.actors || []

  const items = useMemo(() => getItems(actors), [actors])

  const extReferences: References = useMemo(() => ({
    ...references,
    actors: {
      items,
    },
  }), [references])

  return (
    <Widget path={path} fields={fields} references={extReferences} />
  )
}
