import {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useContext,
  FC,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'antd';
import type { Actor } from 'dacha';

import { Modal } from '../../components';
import { EngineContext } from '../../providers';
import { Settings } from '../../../engine/components';
import { EventType } from '../../../events';

import { modals } from './components';

export const SettingsModal: FC = () => {
  const { t } = useTranslation();
  const { world } = useContext(EngineContext);

  const [open, setOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string>();

  const handleEditorOpen = useCallback(() => setOpen(true), []);
  const handleEditorClose = useCallback(() => setOpen(false), []);

  const [settings, setSettings] = useState<Record<string, unknown>>();

  useEffect(() => {
    const handleSettingsMessage = (modalType: string): void => {
      setActiveKey(modalType);
      handleEditorOpen();
    };

    window.electron.onSettings(handleSettingsMessage);
  }, []);

  useEffect(() => {
    const handleSettingsUpdate = (): void => {
      const mainActor = world.data.mainActor as Actor;
      const { data } = mainActor.getComponent(Settings);

      setSettings({ ...data });
    };

    handleSettingsUpdate();

    world.addEventListener(EventType.SetSettingsValue, handleSettingsUpdate);

    return (): void =>
      world.removeEventListener(
        EventType.SetSettingsValue,
        handleSettingsUpdate,
      );
  }, []);

  const tabItems = useMemo(
    () =>
      settings === undefined
        ? []
        : Object.entries(modals)
            .filter(
              (entry): entry is [string, NonNullable<(typeof entry)[1]>] =>
                entry[1] !== undefined,
            )
            .map(([key, { component: Component, title }]) => ({
              key,
              label: t(title),
              children: <Component settings={settings} />,
            })),
    [settings, t],
  );

  if (
    activeKey === undefined ||
    settings === undefined ||
    modals[activeKey] === undefined
  ) {
    return null;
  }

  return (
    <Modal
      title={t('settings.modal.title')}
      open={open}
      onCancel={handleEditorClose}
      width="380px"
    >
      <Tabs activeKey={activeKey} onChange={setActiveKey} items={tabItems} />
    </Modal>
  );
};
