import {
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import {
  ScissorOutlined,
  CopyOutlined,
  SnippetsOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

import { HotkeysSectionContext } from '../../providers'

import { ButtonCSS } from './hotkeys-bar.style'

export const HotkeysBar: FC = () => {
  const { t } = useTranslation()

  const {
    cut, copy, paste, remove,
  } = useContext(HotkeysSectionContext)

  return (
    <>
      <Button
        css={ButtonCSS}
        icon={<ScissorOutlined />}
        size="small"
        onClick={cut}
        title={t('explorer.actionBar.cut.button.title')}
      />
      <Button
        css={ButtonCSS}
        icon={<CopyOutlined />}
        size="small"
        onClick={copy}
        title={t('explorer.actionBar.copy.button.title')}
      />
      <Button
        css={ButtonCSS}
        icon={<SnippetsOutlined />}
        size="small"
        onClick={paste}
        title={t('explorer.actionBar.paste.button.title')}
      />
      <Button
        css={ButtonCSS}
        icon={<DeleteOutlined />}
        size="small"
        onClick={remove}
        title={t('explorer.actionBar.delete.button.title')}
      />
    </>
  )
}
