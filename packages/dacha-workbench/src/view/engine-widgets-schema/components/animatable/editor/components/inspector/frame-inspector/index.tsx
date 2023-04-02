import React, {
  useMemo,
  useContext,
  FC,
} from 'react'
import type { Animation } from 'remiz'

import { MultiField } from '../../../../../../../modules/inspector/components/multi-field'
import { useConfig } from '../../../../../../../hooks'
import { AnimationEditorContext } from '../../../providers'

export const FrameInspector: FC = () => {
  const {
    path,
    selectedState,
    selectedSubstate,
    selectedFrame,
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

  return (
    <form className="animation-inspector__form">
      <MultiField path={fieldsPath} />
    </form>
  )
}
