import { useCallback, useState } from 'react';
import type { ReactElement, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Select } from 'antd';
import { EntityIcon } from '../entity-icon';

import { CreateNewModal } from './create-new-modal';
import { cx } from '../../../../../utils/cx';

import * as styles from './entity-picker.module.css';

interface EntityMultiselectProps {
  placeholder: string;
  options: {
    label: string;
    value: string;
    icon?: string;
  }[];
  onAdd: (value: string) => void;
  onCreate: (name: string, path: string) => void;
  type: string;
  size?: 'middle' | 'small';
  className?: string;
}

export const EntityMultiselect: FC<EntityMultiselectProps> = ({
  placeholder,
  options,
  onAdd,
  onCreate,
  type,
  size = 'middle',
  className,
}): ReactElement => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const handleCancel = useCallback(() => setOpen(false), []);
  const handleOpen = useCallback(() => setOpen(true), []);

  return (
    <>
      <Select
        className={cx(styles.select, className)}
        size={size}
        options={options}
        onChange={onAdd}
        value={null}
        placeholder={placeholder}
        open={open ? false : undefined}
        showSearch
        optionRender={(option): ReactElement => (
          <span className={styles.option}>
            <EntityIcon
              name={option.data.label}
              icon={option.data.icon}
              background={false}
            />
            {option.data.label}
          </span>
        )}
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
