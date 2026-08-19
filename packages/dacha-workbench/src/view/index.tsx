import type { ReactElement } from 'react';
import { App as DSApp } from 'antd';

import { BottomBar, SettingsModal } from './modules';
import { useUnsavedChanges, useEditorReady } from './hooks';
import { EditorLayout } from './editor-layout';
import styles from './app.module.css';

export const App = (): ReactElement => {
  const isEditorReady = useEditorReady();

  useUnsavedChanges();

  return (
    <DSApp className={styles.editor}>
      <EditorLayout />
      {isEditorReady && <BottomBar />}
      {isEditorReady && <SettingsModal />}
    </DSApp>
  );
};
