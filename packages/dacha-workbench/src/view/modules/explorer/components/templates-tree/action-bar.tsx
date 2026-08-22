import {
  useCallback,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import {
  FilePlus,
} from '@gravity-ui/icons'

import styles from '../../explorer.module.css'
import { useCommander } from '../../../../hooks'
import { addTemplate } from '../../../../commands/templates'
import { InspectedEntityContext } from '../../../../providers'
import { HotkeysBar, Icon } from '../../../../components'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const { path: inspectedEntityPath, type } = useContext(InspectedEntityContext)

  const handleAdd = useCallback(() => {
    const pathToAdd = !inspectedEntityPath || type !== 'template'
      ? ['templates']
      : inspectedEntityPath.concat('children')

    dispatch(addTemplate(pathToAdd))
  }, [dispatch, inspectedEntityPath, type])

  return (
    <header className={styles.actionBar}>
      <Button
        className={styles.button}
        icon={<Icon icon={<FilePlus />} />}
        onClick={handleAdd}
        title={t('explorer.templates.actionBar.addTemplate.button.title')}
      />

      <div className={styles.additionalSection}>
        <HotkeysBar />
      </div>
    </header>
  )
}
