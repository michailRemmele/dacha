import { v4 as uuidv4 } from 'uuid'
import { t } from 'i18next'
import type { Animation } from 'dacha'

import { getUniqueName } from '../../../../../../../../../utils/get-unique-name'
import { addValue } from '../../../../../../../../commands'
import { PICK_MODE } from '../../const'
import type { DispatchFn, GetStateFn } from '../../../../../../../../hooks/use-commander'

export const addSubstate = (
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const destination = getState(destinationPath) as Animation.SubstateConfig[]
  const state = getState(destinationPath.slice(0, -1)) as Animation.GroupStateConfig

  dispatch(addValue(destinationPath, {
    id: uuidv4(),
    name: getUniqueName(t('components.animatable.editor.substate.new.title'), destination),
    timeline: {
      frames: [],
      looped: false,
    },
    x: 0,
    y: state.pickMode === PICK_MODE.TWO_DIMENSIONAL ? 0 : undefined,
  }))
}
