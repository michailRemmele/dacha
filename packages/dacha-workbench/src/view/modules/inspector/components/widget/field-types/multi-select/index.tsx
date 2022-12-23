import React, { useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'

import { LabelledMultiSelect } from '../../../multi-select'
import type { MultiSelectProps } from '../../../../../../../types/inputs'
import type { LabelledProps } from '../../../labelled'
import type { Reference } from '../../../../../../../types/widget-schema'

type MultiSelectFieldProps = {
  reference?: Reference
} & Omit<MultiSelectProps, 'options'> & LabelledProps

export const MultiSelectField: FC<MultiSelectFieldProps> = ({
  reference,
  ...props
}) => {
  const { t } = useTranslation()

  const options = useMemo(() => reference?.items.map(({ title, value }) => ({
    title: t(title),
    value,
  })) || [], [reference])

  return (
    <LabelledMultiSelect
      options={options}
      {...props}
    />
  )
}
