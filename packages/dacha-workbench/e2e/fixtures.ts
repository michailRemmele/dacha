import { test as base } from '@playwright/test';

import { launchApp, closeApp } from './launch-app';
import { Editor } from './pages/editor';

/** Every test gets its own editor, launched over a fresh copy of the fixture project. */
export const test = base.extend<{ editor: Editor }>({
  // eslint-disable-next-line no-empty-pattern
  editor: async ({}, use) => {
    const launched = await launchApp();
    await use(new Editor(launched));
    await closeApp(launched);
  },
});

export { expect } from '@playwright/test';
