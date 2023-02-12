import React, { useMemo, FC } from 'react'
import type { SceneConfig, LevelConfig, GameObjectConfig } from 'remiz'

import type { References, WidgetProps } from '../../../../types/widget-schema'
import { Widget } from '../../../modules/inspector/components/widget'
import { useConfig } from '../../../hooks'

const SCENE_PATH_LENGTH = 2

const getItems = (
  gameObjects: Array<GameObjectConfig>,
  parent?: GameObjectConfig,
): Array<{ title: string, value: string }> => gameObjects.reduce((acc, gameObject) => {
  acc.push({
    title: parent ? `${parent.name}.${gameObject.name}` : gameObject.name,
    value: gameObject.id,
  })

  if (gameObject.children?.length) {
    acc.push(...getItems(gameObject.children, gameObject))
  }

  return acc
}, [] as Array<{ title: string, value: string }>)

export const CameraSystemWidget: FC<WidgetProps> = ({ fields, path, references }) => {
  const scene = useConfig(path.slice(0, SCENE_PATH_LENGTH)) as SceneConfig
  const level = useConfig(typeof scene.levelId === 'string' ? ['levels', `id:${scene.levelId}`] : void 0) as LevelConfig
  const gameObjects = level?.gameObjects || []

  const items = useMemo(() => getItems(gameObjects), [gameObjects])

  const extReferences: References = useMemo(() => ({
    ...references,
    gameObjects: {
      items,
    },
  }), [references])

  return (
    <Widget path={path} fields={fields} references={extReferences} />
  )
}
