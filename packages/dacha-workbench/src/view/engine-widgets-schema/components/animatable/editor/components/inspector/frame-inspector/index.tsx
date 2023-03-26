import React, {
  useCallback,
  useMemo,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import type { Animation } from 'remiz'

import { MultiField } from '../../../../../../../modules/inspector/components/multi-field'
import { useConfig, useCommander } from '../../../../../../../hooks'
import { deleteValue } from '../../../../../../../commands'
import { AnimationEditorContext } from '../../../providers'

export const FrameInspector: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const {
    path,
    selectedState,
    selectedSubstate,
    selectedFrame,
    selectEntity,
    setFrame,
  } = useContext(AnimationEditorContext)

  const statePath = useMemo(
    () => path.concat('states', `id:${selectedState as string}`),
    [path, selectedFrame],
  )
  const state = useConfig(statePath) as Animation.StateConfig

  const framePath = useMemo(() => {
    if (state.type === 'individual') {
      return statePath.concat('timeline', 'frames', `id:${selectedFrame as string}`)
    }

    return statePath.concat(
      'substates',
      `id:${selectedSubstate as string}`,
      'timeline',
      'frames',
      `id:${selectedFrame as string}`,
    )
  }, [statePath, state, selectedSubstate, selectedFrame])
  const fieldsPath = useMemo(() => framePath.concat('fields'), [framePath])

  const handleDelete = useCallback(() => {
    selectEntity()
    setFrame()
    dispatch(deleteValue(framePath))
  }, [dispatch, framePath, setFrame, selectEntity])

  return (
    <form className="animation-inspector__form">
      <MultiField path={fieldsPath} />
      <footer className="animation-inspector__footer">
        <Button
          className="animation-inspector__button"
          size="small"
          onClick={handleDelete}
        >
          {t('components.animatable.editor.frame.delete.button.title')}
        </Button>
      </footer>
    </form>
  )
}
