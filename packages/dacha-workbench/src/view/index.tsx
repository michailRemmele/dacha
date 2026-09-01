import type { ReactElement } from 'react';
import { App as DSApp } from 'antd';

import { BottomBar, TitleBar, SettingsModal } from './modules';
import { useUnsavedChanges, useEditorReady } from './hooks';
import { EditorLayout } from './editor-layout';
import * as styles from './app.module.css';

export const App = (): ReactElement => {
  const isEditorReady = useEditorReady();

  const unsavedChanges = useUnsavedChanges();

  return (
    <DSApp className={styles.editor}>
      <TitleBar unsavedChanges={unsavedChanges} />
      <EditorLayout />
      {isEditorReady && <BottomBar />}
      {isEditorReady && <SettingsModal />}
    </DSApp>
  );
};
