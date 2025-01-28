import {
  useMemo,
  useContext,
  FC,
} from 'react'

import { FormStyled } from '../inspector.style'
import { MultiField } from '../../../../../../../components/multi-field'
import { AnimationEditorContext } from '../../../providers'

export const FrameInspector: FC = () => {
  const { selectedEntity } = useContext(AnimationEditorContext)

  const framePath = selectedEntity?.path as string[]
  const fieldsPath = useMemo(() => framePath.concat('fields'), [framePath])

  return (
    <FormStyled>
      <MultiField path={fieldsPath} />
    </FormStyled>
  )
}
