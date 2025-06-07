import { useMemo, useContext, FC } from 'react'
import { useTranslation } from 'react-i18next'

import { useStore } from '../../../../../../hooks'
import { LabelledSelect } from '../../../select'
import type { SelectProps, SelectOption } from '../../../../../../../types/inputs'
import type { GetOptionsFn } from '../../../../../../../types/widget-schema'
import type { LabelledProps } from '../../../labelled'
import { WidgetFieldContext } from '../../widget-field-context'

type SelectFieldProps = {
  options: SelectOption[] | string[] | GetOptionsFn
} & Omit<SelectProps, 'options'> & LabelledProps

export const SelectField: FC<SelectFieldProps> = ({
  options,
  ...props
}) => {
  const { t } = useTranslation()
  const store = useStore()
  const context = useContext(WidgetFieldContext)

  const formattedOptions = useMemo(
    () => {
      const list = typeof options === 'function'
        ? options((path) => store.get(path), context)
        : options

      return list.map(
        (option) => (typeof option === 'string'
          ? { title: option, value: option }
          : { title: t(option.title), value: option.value }),
      )
    },
    [store, context, options],
  )

  return (
    <LabelledSelect
      options={formattedOptions}
      {...props}
    />
  )
}
