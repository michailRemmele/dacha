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
import { Transform } from 'dacha'
import type { Actor } from 'dacha'

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
  } = useContext(EngineContext)

  const mainActor = scene.data.mainActor as Actor

  const actorId = useMemo(() => path?.at(-1)?.split(':')[1], [path])
  const [selectedActor, setSelectedActor] = useState<Actor | undefined>()

  useEffect(() => {
    if (actorId === undefined) {
      return () => {}
    }

    const handleGameStateUpdate = (): void => {
      const actor = scene.getEntityById(actorId)

      if (!actor) {
        setSelectedActor(undefined)
        return
      }

      const transform = actor.getComponent(Transform)
      if (transform === undefined) {
        setSelectedActor(undefined)
        return
      }

      setSelectedActor(actor)
    }

    gameStateObserver.subscribe(handleGameStateUpdate)

    return () => {
      setSelectedActor(undefined)
      gameStateObserver.unsubscribe(handleGameStateUpdate)
    }
  }, [actorId, gameStateObserver, scene])

  const handleClick = useCallback(() => {
    if (selectedActor === undefined) {
      return
    }

    pushAction(() => {
      const mainActorTransform = mainActor.getComponent(Transform)
      const transform = selectedActor.getComponent(Transform)

      mainActorTransform.offsetX = transform.offsetX
      mainActorTransform.offsetY = transform.offsetY
    })
  }, [pushAction, mainActor, selectedActor])

  return (
    <Button
      css={ButtonCSS}
      icon={<AimOutlined />}
      size="small"
      onClick={handleClick}
      title={t('explorer.levels.actionBar.focusActor.button.title')}
      disabled={selectedActor === undefined}
    />
  )
}
