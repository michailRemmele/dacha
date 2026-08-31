import { cpSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { _electron as electron } from '@playwright/test';
import type { ElectronApplication, Page } from '@playwright/test';

const WORKBENCH_ROOT = path.resolve(__dirname, '..');
const MAIN_ENTRY = path.join(WORKBENCH_ROOT, 'index.js');
const SOURCE_FIXTURE = path.join(WORKBENCH_ROOT, 'fixture');

export interface LaunchedApp {
  app: ElectronApplication;
  window: Page;
}

export const launchApp = async (): Promise<LaunchedApp> => {
  const originalCwd = mkdtempSync(path.join(tmpdir(), 'dacha-workbench-e2e-'));

  const fixtureCopy = path.join(originalCwd, 'fixture');
  cpSync(SOURCE_FIXTURE, fixtureCopy, { recursive: true });

  const editorConfigPath = path.join(originalCwd, 'editor-config.json');
  writeFileSync(
    editorConfigPath,
    JSON.stringify({
      projectConfig: path.join(fixtureCopy, 'config.json'),
      assetsRoot: fixtureCopy,
      contextRoot: path.join(fixtureCopy, 'src'),
      autoSave: false,
    }),
  );

  // If this test runner itself is spawned from inside another Electron app
  // (e.g. an Electron-based IDE/extension host), ELECTRON_RUN_AS_NODE=1 gets
  // inherited via process.env and forces the launched Electron binary into
  // plain-Node mode, making `require('electron')` return a path string
  // instead of the real API. Strip it so the app always launches for real.
  const env = {
    ...process.env,
    NODE_ENV: 'production',
    EDITOR_CONFIG: editorConfigPath,
    ORIGINAL_CWD: originalCwd,
  } as Record<string, string>;
  delete env.ELECTRON_RUN_AS_NODE;

  const app = await electron.launch({
    args: [MAIN_ENTRY],
    cwd: WORKBENCH_ROOT,
    env,
  });

  const window = await app.firstWindow();

  return { app, window };
};

export const closeApp = async (launched: LaunchedApp): Promise<void> => {
  await launched.window.evaluate(() =>
    window.electron.setUnsavedChanges(false),
  );
  await launched.app.close();
};
