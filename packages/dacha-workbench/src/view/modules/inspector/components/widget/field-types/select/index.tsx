import React, { useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'

import { LabelledSelect } from '../../../select'
import type { SelectProps } from '../../../../../../../types/inputs'
import type { LabelledProps } from '../../../labelled'
import type { Reference } from '../../../../../../../types/widget-schema'

type SelectFieldProps = {
  referenceId: string
  references: Record<string, Reference | undefined>
} & Omit<SelectProps, 'options'> & LabelledProps

export const SelectField: FC<SelectFieldProps> = ({
  referenceId,
  references,
  ...props
}) => {
  const { t } = useTranslation()

  const options = useMemo(() => references[referenceId]?.items.map(({ title, value }) => ({
    title: t(title),
    value,
  })) || [], [references, referenceId])

  return (
    <LabelledSelect
      options={options}
      {...props}
    />
  )
}
