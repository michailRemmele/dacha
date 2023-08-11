import {
  useCallback,
  useMemo,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { AimOutlined } from '@ant-design/icons'
import type {
  GameObject,
  Transform,
} from 'remiz'

import { EngineContext } from '../../../../../../providers'
import { ButtonCSS } from '../../../../explorer.style'

const TRANSFORM_COMPONENT_NAME = 'transform'

interface FocusActionButtonProps {
  path?: Array<string>
}

export const FocusActionButton: FC<FocusActionButtonProps> = ({
  path,
}) => {
  const { t } = useTranslation()
  const { sceneContext, pushAction, gameObjects } = useContext(EngineContext)

  const mainObject = sceneContext.data.mainObject as GameObject

  const gameObjectId = useMemo(() => path?.at(-1)?.split(':')[1], [path])
  const [selectedGameObject, setSelectedGameObject] = useState<GameObject | undefined>()

  useEffect(() => {
    if (gameObjectId === undefined) {
      return () => {}
    }

    const handleUpdate = (value: unknown): void => {
      const gameObject = value as GameObject | null

      if (!gameObject) {
        setSelectedGameObject(undefined)
        return
      }

      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME) as Transform | undefined
      if (transform === undefined) {
        setSelectedGameObject(undefined)
        return
      }

      setSelectedGameObject(gameObject)
    }

    gameObjects.subscribe(handleUpdate, gameObjectId)

    return () => {
      setSelectedGameObject(undefined)
      gameObjects.unsubscribe(handleUpdate, gameObjectId)
    }
  }, [gameObjectId])

  const handleClick = useCallback(() => {
    if (selectedGameObject === undefined) {
      return
    }

    pushAction(() => {
      const mainObjectTransform = mainObject.getComponent(TRANSFORM_COMPONENT_NAME) as Transform
      const transform = selectedGameObject.getComponent(TRANSFORM_COMPONENT_NAME) as Transform

      mainObjectTransform.offsetX = transform.offsetX
      mainObjectTransform.offsetY = transform.offsetY
    })
  }, [pushAction, mainObject, selectedGameObject])

  return (
    <Button
      css={ButtonCSS}
      icon={<AimOutlined />}
      size="small"
      onClick={handleClick}
      title={t('explorer.levels.actionBar.focusGameObject.button.title')}
      disabled={selectedGameObject === undefined}
    />
  )
}
