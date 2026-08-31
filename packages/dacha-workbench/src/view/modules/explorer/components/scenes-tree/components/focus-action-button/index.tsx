import { useCallback, useContext } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TargetDart } from '@gravity-ui/icons'
import { Transform, Actor } from 'dacha'

import { getActorIdByPath } from '../../../../../../../utils/get-actor-id-by-path'
import { EngineContext } from '../../../../../../providers'
import { Icon, IconButton } from '../../../../../../components'
import styles from '../../../../explorer.module.css'

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
    <IconButton
      className={styles.button}
      icon={<Icon icon={<TargetDart />} />}
      onClick={handleClick}
      title={t('explorer.scenes.actionBar.focusActor.button.title')}
      disabled={path === undefined}
    />
  )
}
