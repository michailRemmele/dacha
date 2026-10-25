import { useCallback, useMemo, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TriangleExclamation } from '@gravity-ui/icons';

import { Icon } from '../../../../../../components/icon';
import { Labelled } from '../../../labelled';
import { Select } from '../../../select';
import type { SelectOption } from '../../../../../../../types/inputs';
import { NAMESPACE_EDITOR } from '../../../../../../providers/schemas-provider/consts';

import * as styles from './reference.module.css';

export interface ReferenceSelectProps {
  value: string | null;
  options: SelectOption[];
  available?: boolean;
  onChange: (value: string | null) => void;
  onAccept?: () => void;
  label?: string;
  className?: string;
}

export const ReferenceSelect: FC<ReferenceSelectProps> = ({
  value,
  options,
  available = true,
  onChange,
  onAccept,
  label,
  className,
}) => {
  const { t } = useTranslation(NAMESPACE_EDITOR);

  const isMissing =
    !!value && !options.some((option) => option.value === value);

  const selectOptions = useMemo(
    () =>
      isMissing
        ? [
            ...options,
            {
              title: t('inspector.reference.missing'),
              value: value as string,
              disabled: true,
            },
          ]
        : options,
    [options, isMissing, value, t],
  );

  const renderMissing = useCallback(
    () => (
      <span className={styles.missing} data-testid="reference-missing">
        <Icon icon={<TriangleExclamation />} size={12} />
        {t('inspector.reference.missing')}
      </span>
    ),
    [t],
  );

  const select = (
    <Select
      className={className}
      options={selectOptions}
      value={value || null}
      onChange={onChange}
      onAccept={onAccept}
      allowEmpty={available}
      searchable
      disabled={!available}
      placeholder={t('inspector.reference.noValues')}
      labelRender={isMissing ? renderMissing : undefined}
    />
  );

  return label === undefined ? (
    select
  ) : (
    <Labelled label={label}>{select}</Labelled>
  );
};
