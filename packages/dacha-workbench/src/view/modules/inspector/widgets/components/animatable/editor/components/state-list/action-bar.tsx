import {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import {
  PlusOutlined,
  PlusCircleOutlined,
  RightCircleOutlined,
} from '@ant-design/icons'
import type { Animation } from 'dacha'

import { getStatePath } from '../../utils/paths'
import { ActionBarStyled, ActionButtonCSS } from '../../editor.style'
import { useConfig, useCommander } from '../../../../../../../../hooks'
import { HotkeysBar } from '../../../../../../../../components'
import { AnimationEditorContext } from '../../providers'
import { addState, addSubstate, setInitialState } from '../../commands/states'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const {
    path,
    inspectedEntity,
  } = useContext(AnimationEditorContext)

  const statePath = inspectedEntity ? getStatePath(inspectedEntity.path) : undefined

  const statesPath = useMemo(() => path.concat('states'), [path])
  const substatesPath = useMemo(
    () => statePath && statePath.concat('substates'),
    [statePath],
  )

  const selectedStateConfig = useConfig(statePath) as Animation.StateConfig | undefined

  const handleAddSubstate = useCallback(() => {
    dispatch(addSubstate(substatesPath as string[]))
  }, [dispatch, substatesPath])

  const handleAddState = useCallback(() => {
    dispatch(addState(statesPath))
  }, [dispatch, statesPath])

  const handleInitialSet = useCallback(() => {
    dispatch(setInitialState(statePath as string[]))
  }, [dispatch, statePath])

  return (
    <ActionBarStyled>
      <Button
        css={ActionButtonCSS}
        icon={<PlusOutlined />}
        size="small"
        onClick={handleAddState}
        title={t('components.animatable.editor.state.add.button.title')}
      />
      <Button
        css={ActionButtonCSS}
        icon={<PlusCircleOutlined />}
        size="small"
        onClick={handleAddSubstate}
        title={t('components.animatable.editor.substate.add.button.title')}
        disabled={(inspectedEntity?.type !== 'state' || selectedStateConfig?.type !== 'group') && inspectedEntity?.type !== 'substate'}
      />
      <Button
        css={ActionButtonCSS}
        icon={<RightCircleOutlined />}
        size="small"
        onClick={handleInitialSet}
        title={t('components.animatable.editor.state.setInitial.button.title')}
        disabled={inspectedEntity?.type !== 'state'}
      />

      <HotkeysBar />
    </ActionBarStyled>
  )
}
