import { useMemo, useContext, FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useStore } from '../../../../../../hooks';
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
  ...props
}) => {
  const { t } = useTranslation();
  const store = useStore();
  const context = useContext(WidgetFieldContext);

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
  }, [store, context, options]);

  return <LabelledMultiSelect options={formattedOptions} {...props} />;
};
