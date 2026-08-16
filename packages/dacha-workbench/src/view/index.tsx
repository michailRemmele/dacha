import type { ReactElement } from 'react';
import { App as DSApp } from 'antd';

import { BottomBar, SettingsModal } from './modules';
import { useUnsavedChanges, useEditorReady } from './hooks';
import { EditorLayout } from './editor-layout';
import { EditorCSS } from './app.style';

export const App = (): ReactElement => {
  const isEditorReady = useEditorReady();

  useUnsavedChanges();

  return (
    <DSApp css={EditorCSS}>
      <EditorLayout />
      {isEditorReady && <BottomBar />}
      {isEditorReady && <SettingsModal />}
    </DSApp>
  );
};
