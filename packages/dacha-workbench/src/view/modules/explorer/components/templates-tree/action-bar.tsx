import {
  useCallback,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import {
  FileAddOutlined,
} from '@ant-design/icons'

import { ActionBarStyled, ButtonCSS, AdditionalSectionStyled } from '../../explorer.style'
import { useCommander } from '../../../../hooks'
import { addTemplate } from '../../../../commands/templates'
import { InspectedEntityContext } from '../../../../providers'
import { HotkeysBar } from '../hotkeys-bar'

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
    <ActionBarStyled>
      <Button
        css={ButtonCSS}
        icon={<FileAddOutlined />}
        size="small"
        onClick={handleAdd}
        title={t('explorer.templates.actionBar.addTemplate.button.title')}
      />

      <AdditionalSectionStyled>
        <HotkeysBar />
      </AdditionalSectionStyled>
    </ActionBarStyled>
  )
}
