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
import { Transform } from 'remiz'
import type { GameObject } from 'remiz'

import { EngineContext } from '../../../../../../providers'
import { ButtonCSS } from '../../../../explorer.style'

interface FocusActionButtonProps {
  path?: Array<string>
}

export const FocusActionButton: FC<FocusActionButtonProps> = ({
  path,
}) => {
  const { t } = useTranslation()
  const {
    scene,
    pushAction,
    gameStateObserver,
    gameObjectObserver,
  } = useContext(EngineContext)

  const mainObject = scene.context.data.mainObject as GameObject

  const gameObjectId = useMemo(() => path?.at(-1)?.split(':')[1], [path])
  const [selectedGameObject, setSelectedGameObject] = useState<GameObject | undefined>()

  useEffect(() => {
    if (gameObjectId === undefined) {
      return () => {}
    }

    const handleGameStateUpdate = (): void => {
      const gameObject = gameObjectObserver.getById(gameObjectId)

      if (!gameObject) {
        setSelectedGameObject(undefined)
        return
      }

      const transform = gameObject.getComponent(Transform)
      if (transform === undefined) {
        setSelectedGameObject(undefined)
        return
      }

      setSelectedGameObject(gameObject)
    }

    gameStateObserver.subscribe(handleGameStateUpdate)

    return () => {
      setSelectedGameObject(undefined)
      gameStateObserver.unsubscribe(handleGameStateUpdate)
    }
  }, [gameObjectId, gameStateObserver, gameObjectObserver])

  const handleClick = useCallback(() => {
    if (selectedGameObject === undefined) {
      return
    }

    pushAction(() => {
      const mainObjectTransform = mainObject.getComponent(Transform)
      const transform = selectedGameObject.getComponent(Transform)

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
