import {
  useMemo,
  useContext,
  FC,
} from 'react'

import { FormStyled } from '../inspector.style'
import { MultiField } from '../../../../../../../components/multi-field'
import { AnimationEditorContext } from '../../../providers'

export const FrameInspector: FC = () => {
  const { selectedFrame } = useContext(AnimationEditorContext)

  const framePath = selectedFrame as Array<string>
  const fieldsPath = useMemo(() => framePath.concat('fields'), [framePath])

  return (
    <FormStyled>
      <MultiField path={fieldsPath} />
    </FormStyled>
  )
}
