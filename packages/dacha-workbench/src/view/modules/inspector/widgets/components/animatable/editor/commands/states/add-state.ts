import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { Animation } from 'dacha'

import { getUniqueName } from '../../../../../../../../../utils/get-unique-name'
import { addValue } from '../../../../../../../../commands'
import { STATE_TYPE } from '../../const'
import type { DispatchFn, GetStateFn } from '../../../../../../../../hooks/use-commander'

export const addState = (
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const destination = getState(destinationPath) as Animation.StateConfig[]

  dispatch(addValue(destinationPath, {
    id: uuidv4(),
    name: getUniqueName(i18next.t('components.animatable.editor.state.new.title'), destination),
    type: STATE_TYPE.INDIVIDUAL,
    speed: 1,
    timeline: {
      frames: [],
      looped: false,
    },
    transitions: [],
  }))
}
