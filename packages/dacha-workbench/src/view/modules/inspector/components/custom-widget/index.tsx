import React, { FC } from 'react'
import { useTranslation, I18nextProvider } from 'react-i18next'

import type { WidgetProps } from '../../../../../types/widget-schema'

interface CustomWidgetProps extends WidgetProps {
  component: FC<WidgetProps>
  namespace: string
}

export const CustomWidget: FC<CustomWidgetProps> = ({
  fields,
  references,
  path,
  component: View,
  namespace,
}) => {
  const { i18n } = useTranslation()

  return (
    <I18nextProvider i18n={i18n} defaultNS={namespace}>
      <View
        fields={fields}
        references={references}
        path={path}
      />
    </I18nextProvider>
  )
}
