import React, { useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'

import { LabelledSelect } from '../../../select'
import type { SelectProps } from '../../../../../../../types/inputs'
import type { LabelledProps } from '../../../labelled'
import type { Reference } from '../../../../../../../types/widget-schema'

type SelectFieldProps = {
  reference?: Reference
} & Omit<SelectProps, 'options'> & LabelledProps

export const SelectField: FC<SelectFieldProps> = ({
  reference,
  ...props
}) => {
  const { t } = useTranslation()

  const options = useMemo(() => reference?.items.map(({ title, value }) => ({
    title: t(title),
    value,
  })) || [], [reference])

  return (
    <LabelledSelect
      options={options}
      {...props}
    />
  )
}
