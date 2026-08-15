import {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { Plus } from '@gravity-ui/icons'

import { getStatePath } from '../../utils/paths'
import { ActionBarStyled, ActionButtonCSS } from '../../editor.style'
import { useCommander } from '../../../../../../../../hooks'
import { HotkeysBar, Icon } from '../../../../../../../../components'
import { AnimationEditorContext } from '../../providers'
import { addTransition } from '../../commands/transitions'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const { inspectedEntity } = useContext(AnimationEditorContext)

  const statePath = inspectedEntity ? getStatePath(inspectedEntity.path) : undefined

  const transitionsPath = useMemo(() => statePath && statePath.concat('transitions'), [statePath])

  const handleAdd = useCallback(() => {
    dispatch(addTransition(transitionsPath as string[]))
  }, [dispatch, transitionsPath])

  return (
    <ActionBarStyled>
      <Button
        css={ActionButtonCSS}
        icon={<Icon icon={<Plus />} />}
        size="small"
        onClick={handleAdd}
        title={t('components.animatable.editor.transition.add.button.title')}
        disabled={statePath === undefined}
      />

      <HotkeysBar />
    </ActionBarStyled>
  )
}
