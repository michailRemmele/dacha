import {
  useCallback,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import {
  FilePlus,
  FolderPlus,
} from '@gravity-ui/icons'

import styles from '../../explorer.module.css'
import { useCommander } from '../../../../hooks'
import { addActor, addScene } from '../../../../commands/scenes'
import { InspectedEntityContext } from '../../../../providers'
import { HotkeysBar, Icon } from '../../../../components'

import { FocusActionButton } from './components'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const { path: inspectedEntityPath, type } = useContext(InspectedEntityContext)

  const handleAddActor = useCallback(() => {
    if (!inspectedEntityPath) {
      return
    }

    const pathToAdd = inspectedEntityPath.concat(type === 'scene' ? 'actors' : 'children')

    dispatch(addActor(pathToAdd))
  }, [dispatch, inspectedEntityPath, type])

  const handleAddScene = useCallback(() => {
    dispatch(addScene())
  }, [dispatch])

  return (
    <header className={styles.actionBar}>
      <Button
        className={styles.button}
        icon={<Icon icon={<FilePlus />} />}
        onClick={handleAddActor}
        title={t('explorer.scenes.actionBar.addActor.button.title')}
        disabled={type !== 'actor' && type !== 'scene'}
      />
      <Button
        className={styles.button}
        icon={<Icon icon={<FolderPlus />} />}
        onClick={handleAddScene}
        title={t('explorer.scenes.actionBar.addScene.button.title')}
      />

      <div className={styles.additionalSection}>
        <HotkeysBar />
      </div>

      <div className={styles.additionalSection}>
        <FocusActionButton
          path={type === 'actor' ? inspectedEntityPath : undefined}
        />
      </div>
    </header>
  )
}
