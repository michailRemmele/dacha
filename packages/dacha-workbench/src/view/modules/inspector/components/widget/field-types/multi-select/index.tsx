import { useMemo, useContext, FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useStore, useConfig } from '../../../../../../hooks';
import { LabelledMultiSelect } from '../../../multi-select';
import type {
  MultiSelectProps,
  SelectOption,
} from '../../../../../../../types/inputs';
import type { GetOptionsFn } from '../../../../../../../types/widget-schema';
import type { LabelledProps } from '../../../labelled';
import { WidgetFieldContext } from '../../widget-field-context';

type MultiSelectFieldProps = {
  options: SelectOption[] | string[] | GetOptionsFn;
} & Omit<MultiSelectProps, 'options'> &
  LabelledProps;

export const MultiSelectField: FC<MultiSelectFieldProps> = ({
  options,
  value,
  ...props
}) => {
  const { t } = useTranslation();
  const store = useStore();
  const context = useContext(WidgetFieldContext);

  const projectConfig = useConfig([]);

  const formattedOptions = useMemo(() => {
    const list =
      typeof options === 'function'
        ? options((path) => store.get(path), context)
        : options;

    return list.map((option) =>
      typeof option !== 'object'
        ? { title: String(option), value: option }
        : { title: t(option.title), value: option.value },
    );
  }, [store, context, options, projectConfig]);

  const formattedValue = useMemo(() => {
    return value.map((entry, index) => {
      const option = formattedOptions.find((opt) => opt.value === entry);
      return option
        ? entry
        : `${t('inspector.components.select.option.none.title')} ${index + 1}`;
    });
  }, [value, formattedOptions]);

  return (
    <LabelledMultiSelect
      options={formattedOptions}
      value={formattedValue}
      {...props}
    />
  );
};
