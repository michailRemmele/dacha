import { createRoot } from 'react-dom/client';
import { use } from 'i18next';
import { initReactI18next } from 'react-i18next';
import 'reflect-metadata';
import 'antd/dist/reset.css';

import { App } from './view';
import {
  EngineProvider,
  EntityExplorerProvider,
  ThemeProvider,
  NotificationProvider,
  NeedsReloadProvider,
  CommandProvider,
  CommandScopeProvider,
  HotkeysProvider,
  HotkeysScopeProvider,
} from './view/providers';
import { APP_ROOT } from './consts/root-nodes';
import { ROOT_SCOPE } from './consts/scopes';

import en from './view/locales/en.json';
import './export';

void use(initReactI18next).init({
  lng: 'en',
  resources: {
    en: {
      translation: en,
    },
  },
});

const root = createRoot(document.getElementById(APP_ROOT) as HTMLElement);

root.render(
  <ThemeProvider>
    <CommandProvider>
      <CommandScopeProvider name={ROOT_SCOPE}>
        <HotkeysProvider>
          <HotkeysScopeProvider name={ROOT_SCOPE}>
            <EngineProvider>
              <EntityExplorerProvider>
                <NotificationProvider>
                  <NeedsReloadProvider>
                    <App />
                  </NeedsReloadProvider>
                </NotificationProvider>
              </EntityExplorerProvider>
            </EngineProvider>
          </HotkeysScopeProvider>
        </HotkeysProvider>
      </CommandScopeProvider>
    </CommandProvider>
  </ThemeProvider>,
);
