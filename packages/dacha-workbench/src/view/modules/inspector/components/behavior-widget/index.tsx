import type { FC } from 'react';
import { useTranslation, I18nextProvider } from 'react-i18next';

import { useBehaviors } from '../../../../hooks/use-behaviors';
import { NAMESPACE_EXTENSION } from '../../../../providers/schemas-provider/consts';
import { Widget } from '../widget';
import { CustomWidget } from '../custom-widget';

interface BehaviorWidgetProps {
  name: string;
  path: string[];
  context?: Record<string, unknown>;
  systemName?: string;
}

export const BehaviorWidget: FC<BehaviorWidgetProps> = ({
  name,
  path,
  context,
  systemName,
}) => {
  const { i18n } = useTranslation();

  const schema = useBehaviors(systemName)?.[name];
  if (!schema) {
    return null;
  }

  if (schema.view) {
    return (
      <CustomWidget {...schema} path={path} namespace={NAMESPACE_EXTENSION} />
    );
  }

  return (
    <I18nextProvider i18n={i18n} defaultNS={NAMESPACE_EXTENSION}>
      <Widget {...schema} path={path} context={context} />
    </I18nextProvider>
  );
};
