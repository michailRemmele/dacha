import {
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import {
  Scissors,
  Copy,
  Files,
  TrashBin,
} from '@gravity-ui/icons'
import { Icon } from '../icon'

import { HotkeysSectionContext } from '../../providers'

import styles from './hotkeys-bar.module.css'

export const HotkeysBar: FC = () => {
  const { t } = useTranslation()

  const {
    cut, copy, paste, remove,
  } = useContext(HotkeysSectionContext)

  return (
    <>
      <Button
        className={styles.button}
        icon={<Icon icon={<Scissors />} />}
        onClick={cut}
        title={t('explorer.actionBar.cut.button.title')}
      />
      <Button
        className={styles.button}
        icon={<Icon icon={<Copy />} />}
        onClick={copy}
        title={t('explorer.actionBar.copy.button.title')}
      />
      <Button
        className={styles.button}
        icon={<Icon icon={<Files />} />}
        onClick={paste}
        title={t('explorer.actionBar.paste.button.title')}
      />
      <Button
        className={styles.button}
        icon={<Icon icon={<TrashBin />} />}
        onClick={remove}
        title={t('explorer.actionBar.delete.button.title')}
      />
    </>
  )
}
