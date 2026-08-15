import { useContext } from 'react';
import { App as DSApp } from 'antd';

import { BottomBar, SettingsModal } from './modules';
import { useUnsavedChanges } from './hooks';
import { EngineContext } from './providers';
import { EditorLayout } from './editor-layout';
import { EditorCSS } from './app.style';

export const App = (): JSX.Element => {
  const context = useContext(EngineContext);

  useUnsavedChanges();

  return (
    <DSApp css={EditorCSS}>
      <EditorLayout />
      {context && <BottomBar />}
      {context && <SettingsModal />}
    </DSApp>
  );
};
