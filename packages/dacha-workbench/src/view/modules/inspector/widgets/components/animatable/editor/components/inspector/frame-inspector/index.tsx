import {
  useMemo,
  useContext,
  FC,
} from 'react'

import styles from '../inspector.module.css'
import { MultiField } from '../../../../../../../components/multi-field'
import { AnimationEditorContext } from '../../../providers'

export const FrameInspector: FC = () => {
  const { inspectedEntity } = useContext(AnimationEditorContext)

  const framePath = inspectedEntity?.path as string[]
  const fieldsPath = useMemo(() => framePath.concat('fields'), [framePath])

  return (
    <form className={styles.form}>
      <MultiField path={fieldsPath} />
    </form>
  )
}
