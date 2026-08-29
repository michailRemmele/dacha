import { useMemo, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
  FloppyDisk,
  ArrowRightFromSquare,
  ArrowRotateLeft,
  ArrowRotateRight,
  Scissors,
  Copy,
  Files,
  TrashBin,
  Gear,
} from '@gravity-ui/icons';

import { Icon } from '../../../../components';

import styles from './app-menu.module.css';

interface MenuButtonProps {
  label: string;
  items: MenuProps['items'];
}

const MenuButton: FC<MenuButtonProps> = ({ label, items }) => (
  <Dropdown
    styles={{
      item: {
        padding: '6px 20px',
      },
      itemIcon: {
        marginInlineEnd: '10px',
      },
    }}
    menu={{ items }}
    trigger={['click']}
  >
    <button type="button" className={styles.menuButton}>
      {label}
    </button>
  </Dropdown>
);

export const AppMenu: FC = () => {
  const { t } = useTranslation();

  const fileItems = useMemo<MenuProps['items']>(
    () => [
      {
        key: 'save',
        label: t('titleBar.menu.file.save.title'),
        icon: <Icon icon={<FloppyDisk />} />,
        onClick: (): void => window.electron.triggerSave(),
      },
      { type: 'divider' },
      {
        key: 'exit',
        label: t('titleBar.menu.file.exit.title'),
        icon: <Icon icon={<ArrowRightFromSquare />} />,
        onClick: (): void => window.electron.quitApp(),
      },
    ],
    [t],
  );

  const editItems = useMemo<MenuProps['items']>(
    () => [
      {
        key: 'undo',
        label: t('titleBar.menu.edit.undo.title'),
        icon: <Icon icon={<ArrowRotateLeft />} />,
        onClick: (): void => window.electron.triggerUndo(),
      },
      {
        key: 'redo',
        label: t('titleBar.menu.edit.redo.title'),
        icon: <Icon icon={<ArrowRotateRight />} />,
        onClick: (): void => window.electron.triggerRedo(),
      },
      { type: 'divider' },
      {
        key: 'cut',
        label: t('titleBar.menu.edit.cut.title'),
        icon: <Icon icon={<Scissors />} />,
        onClick: (): void => window.electron.triggerCut(),
      },
      {
        key: 'copy',
        label: t('titleBar.menu.edit.copy.title'),
        icon: <Icon icon={<Copy />} />,
        onClick: (): void => window.electron.triggerCopy(),
      },
      {
        key: 'paste',
        label: t('titleBar.menu.edit.paste.title'),
        icon: <Icon icon={<Files />} />,
        onClick: (): void => window.electron.triggerPaste(),
      },
      {
        key: 'delete',
        label: t('titleBar.menu.edit.delete.title'),
        icon: <Icon icon={<TrashBin />} />,
        onClick: (): void => window.electron.triggerDelete(),
      },
    ],
    [t],
  );

  const viewItems = useMemo<MenuProps['items']>(
    () => [
      {
        key: 'settings',
        label: t('titleBar.menu.view.settings.title'),
        icon: <Icon icon={<Gear />} />,
        onClick: (): void => window.electron.openSettings('grid'),
      },
    ],
    [t],
  );

  return (
    <div className={styles.appMenu}>
      <MenuButton label={t('titleBar.menu.file.title')} items={fileItems} />
      <MenuButton label={t('titleBar.menu.edit.title')} items={editItems} />
      <MenuButton label={t('titleBar.menu.view.title')} items={viewItems} />
    </div>
  );
};
