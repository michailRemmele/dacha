import { useCallback, useState, useMemo } from 'react';
import type { ReactElement, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Select } from 'antd';

import { CreateNewModal } from './create-new-modal';
import { cx } from '../../../../../utils/cx';

import styles from './entity-picker.module.css';

interface EntitySelectProps {
  options: {
    label: string;
    value: string;
  }[];
  value?: string | null;
  onAdd: (value: string | null) => void;
  onCreate: (name: string, path: string) => void;
  type: string;
  className?: string;
}

export const EntitySelect: FC<EntitySelectProps> = ({
  options,
  value,
  onAdd,
  onCreate,
  type,
  className,
}): ReactElement => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const availableOptions = useMemo(() => {
    return [
      {
        label: t('inspector.components.select.option.none.title'),
        value: null,
      },
      ...options,
    ];
  }, [options]);

  const handleCancel = useCallback(() => setOpen(false), []);
  const handleOpen = useCallback(() => setOpen(true), []);

  return (
    <>
      <div className={cx(styles.entityPicker, className)}>
        <Select
          className={styles.select}
          options={availableOptions}
          onChange={onAdd}
          value={value}
          open={open ? false : undefined}
          showSearch
          popupRender={(menu: ReactElement): ReactElement => (
            <>
              <div>{menu}</div>
              <div className={styles.footer}>
                <Button block onClick={handleOpen}>
                  {t('inspector.entityPicker.createNew.button.title')}
                </Button>
              </div>
            </>
          )}
        />
      </div>

      {open && (
        <CreateNewModal
          type={type}
          open={open}
          onClose={handleCancel}
          onCreate={onCreate}
        />
      )}
    </>
  );
};
