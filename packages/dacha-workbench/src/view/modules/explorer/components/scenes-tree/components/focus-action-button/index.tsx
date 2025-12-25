import { useCallback, useContext } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { AimOutlined } from '@ant-design/icons'
import { Transform, Actor } from 'dacha'

import { getActorIdByPath } from '../../../../../../../utils/get-actor-id-by-path'
import { EngineContext } from '../../../../../../providers'
import { ButtonCSS } from '../../../../explorer.style'

interface FocusActionButtonProps {
  path?: string[]
}

export const FocusActionButton: FC<FocusActionButtonProps> = ({
  path,
}) => {
  const { t } = useTranslation()
  const { world } = useContext(EngineContext)

  const handleClick = useCallback(() => {
    const selectedActorId = getActorIdByPath(path)
    if (!selectedActorId) {
      return
    }

    const mainActor = world.data.mainActor as Actor
    const selectedActor = world.findChildById(selectedActorId)

    if (selectedActor instanceof Actor && selectedActor.getComponent(Transform)) {
      const mainActorTransform = mainActor.getComponent(Transform)
      const transform = selectedActor.getComponent(Transform)

      mainActorTransform.world.position.x = transform.world.position.x
      mainActorTransform.world.position.y = transform.world.position.y
    }
  }, [world, path])

  return (
    <Button
      css={ButtonCSS}
      icon={<AimOutlined />}
      size="small"
      onClick={handleClick}
      title={t('explorer.scenes.actionBar.focusActor.button.title')}
      disabled={path === undefined}
    />
  )
}
