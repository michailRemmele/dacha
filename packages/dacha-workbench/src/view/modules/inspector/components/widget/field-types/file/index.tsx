import { FC } from 'react'

import { LabelledFileInput } from '../../../file-input'
import type { InputProps } from '../../../../../../../types/inputs'
import type { Properties } from '../../../../../../../types/widget-schema'
import type { LabelledProps } from '../../../labelled'

type FileFieldProps = {
  properties?: Properties
} & InputProps & LabelledProps

export const FileField: FC<FileFieldProps> = ({ properties, ...props }) => {
  const extensions = properties?.extensions as Array<string> | undefined

  return (
    <LabelledFileInput
      extensions={extensions}
      {...props}
    />
  )
}
