import React, { useContext, FC } from 'react'
import { useTranslation, I18nextProvider } from 'react-i18next'

import { EngineContext } from '../../../../providers'
import { NAMESPACE_EXTENSION } from '../../../../providers/schemas-provider/consts'
import { useExtension } from '../../../../hooks'
import { get } from '../../../../utils/get'
import { Field } from '../field'
import { Widget } from '../widget'
import { TextInput, LabelledTextInput } from '../text-input'
import { NumberInput, LabelledNumberInput } from '../number-input'
import { Select, LabelledSelect } from '../select'
import { Checkbox, LabelledCheckbox } from '../checkbox'
import type { WidgetProps, WidgetViewProps } from '../../../../../types/widget-schema'
import type { Data } from '../../../../utils/get'

interface CustomWidgetProps extends WidgetProps {
  component: FC<WidgetViewProps>
}

export const CustomWidget: FC<CustomWidgetProps> = ({
  fields,
  references,
  path,
  component: View,
}) => {
  const { i18n } = useTranslation()

  const { sceneContext } = useContext(EngineContext)

  const extension = useExtension()
  const projectConfig = sceneContext.data.projectConfig as Data

  return (
    <I18nextProvider i18n={i18n} defaultNS={NAMESPACE_EXTENSION}>
      <View
        fields={fields}
        references={references}
        path={path}
        context={{ extension, projectConfig }}
        components={{
          Field,
          Widget,
          TextInput,
          LabelledTextInput,
          NumberInput,
          LabelledNumberInput,
          Select,
          LabelledSelect,
          Checkbox,
          LabelledCheckbox,
        }}
        utils={{ get }}
      />
    </I18nextProvider>
  )
}
