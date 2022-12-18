import React, { FC } from 'react'
import { useTranslation, I18nextProvider } from 'react-i18next'

import { NAMESPACE_EXTENSION } from '../../../../providers/schemas-provider/consts'
import type { WidgetProps } from '../../../../../types/widget-schema'

interface CustomWidgetProps extends WidgetProps {
  component: FC<WidgetProps>
}

export const CustomWidget: FC<CustomWidgetProps> = ({
  fields,
  references,
  path,
  component: View,
}) => {
  const { i18n } = useTranslation()

  return (
    <I18nextProvider i18n={i18n} defaultNS={NAMESPACE_EXTENSION}>
      <View
        fields={fields}
        references={references}
        path={path}
      />
    </I18nextProvider>
  )
}
