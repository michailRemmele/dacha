import {
  useCallback,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import {
  FileAddOutlined,
  FolderAddOutlined,
} from '@ant-design/icons'

import { ActionBarStyled, ButtonCSS, AdditionalSectionStyled } from '../../explorer.style'
import { useCommander } from '../../../../hooks'
import { addActor, addLevel } from '../../../../commands/levels'
import { InspectedEntityContext } from '../../../../providers'
import { HotkeysBar } from '../hotkeys-bar'

import { FocusActionButton } from './components'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const { path: inspectedEntityPath, type } = useContext(InspectedEntityContext)

  const handleAddActor = useCallback(() => {
    if (!inspectedEntityPath) {
      return
    }

    const pathToAdd = inspectedEntityPath.concat(type === 'level' ? 'actors' : 'children')

    dispatch(addActor(pathToAdd))
  }, [dispatch, inspectedEntityPath, type])

  const handleAddLevel = useCallback(() => {
    dispatch(addLevel())
  }, [dispatch])

  return (
    <ActionBarStyled>
      <Button
        css={ButtonCSS}
        icon={<FileAddOutlined />}
        size="small"
        onClick={handleAddActor}
        title={t('explorer.levels.actionBar.addActor.button.title')}
        disabled={type !== 'actor' && type !== 'level'}
      />
      <Button
        css={ButtonCSS}
        icon={<FolderAddOutlined />}
        size="small"
        onClick={handleAddLevel}
        title={t('explorer.levels.actionBar.addLevel.button.title')}
      />

      <AdditionalSectionStyled>
        <HotkeysBar />
      </AdditionalSectionStyled>

      <AdditionalSectionStyled>
        <FocusActionButton
          path={type === 'actor' ? inspectedEntityPath : undefined}
        />
      </AdditionalSectionStyled>
    </ActionBarStyled>
  )
}
