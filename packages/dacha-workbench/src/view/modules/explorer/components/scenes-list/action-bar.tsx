import {
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import {
  FileAddOutlined,
} from '@ant-design/icons'

import { ActionBarStyled, ButtonCSS, AdditionalSectionStyled } from '../../explorer.style'
import { useCommander } from '../../../../hooks'
import { addScene } from '../../../../commands/scenes'
import { HotkeysBar } from '../../../../components'

interface ActionBarProps {
  isLoaders?: boolean
}

export const ActionBar: FC<ActionBarProps> = ({ isLoaders }) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const handleAdd = useCallback(() => {
    dispatch(addScene(isLoaders ? ['loaders'] : ['scenes']))
  }, [dispatch, isLoaders])

  return (
    <ActionBarStyled>
      <Button
        css={ButtonCSS}
        icon={<FileAddOutlined />}
        size="small"
        onClick={handleAdd}
        title={
          isLoaders
            ? t('explorer.loaders.actionBar.addLoader.button.title')
            : t('explorer.scenes.actionBar.addScene.button.title')
        }
      />

      <AdditionalSectionStyled>
        <HotkeysBar />
      </AdditionalSectionStyled>
    </ActionBarStyled>
  )
}
