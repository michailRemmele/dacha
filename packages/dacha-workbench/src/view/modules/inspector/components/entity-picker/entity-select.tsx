import { useCallback, useState, useMemo } from 'react';
import type { ReactElement, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Select } from 'antd';

import { CreateNewModal } from './create-new-modal';
import {
  EntityPickerStyled,
  FooterStyled,
  SelectCSS,
} from './entity-picker.style';

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
}): JSX.Element => {
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
      <EntityPickerStyled className={className}>
        <Select
          css={SelectCSS}
          size="small"
          options={availableOptions}
          onChange={onAdd}
          value={value}
          open={open ? false : undefined}
          showSearch
          dropdownRender={(menu): ReactElement => (
            <>
              <div>{menu}</div>
              <FooterStyled>
                <Button block size="small" onClick={handleOpen}>
                  {t('inspector.entityPicker.createNew.button.title')}
                </Button>
              </FooterStyled>
            </>
          )}
        />
      </EntityPickerStyled>

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
