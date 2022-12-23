import React, { useContext, useMemo, FC } from 'react'
import type { SceneConfig, LevelConfig, GameObjectConfig } from 'remiz'

import type { References, WidgetProps } from '../../../../types/widget-schema'
import type { Data } from '../../../utils/get'
import { get } from '../../../utils/get'
import { Widget } from '../../../modules/inspector/components/widget'
import { EngineContext } from '../../../providers'

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
  const { sceneContext } = useContext(EngineContext)
  const projectConfig = sceneContext.data.projectConfig as Data

  const items = useMemo(() => {
    const scene = get(projectConfig, path.slice(0, SCENE_PATH_LENGTH)) as SceneConfig

    if (typeof scene.level !== 'string') {
      return []
    }

    const { gameObjects } = get(projectConfig, ['levels', scene.level]) as LevelConfig

    return getItems(gameObjects)
  }, [projectConfig])

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
