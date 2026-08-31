import { FC } from 'react';
import { useTranslation, I18nextProvider } from 'react-i18next';

import type { WidgetProps } from '../../../../../types/widget-schema';

interface CustomWidgetProps extends WidgetProps {
  view?: FC<WidgetProps>;
  namespace: string;
}

export const CustomWidget: FC<CustomWidgetProps> = ({
  view: View,
  namespace,
  ...props
}) => {
  const { i18n } = useTranslation();

  return (
    <I18nextProvider i18n={i18n} defaultNS={namespace}>
      {View ? <View {...props} /> : null}
    </I18nextProvider>
  );
};
