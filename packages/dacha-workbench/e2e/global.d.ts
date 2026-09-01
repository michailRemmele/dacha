export {};

declare global {
  interface Window {
    electron: {
      setUnsavedChanges: (unsavedChanges: boolean) => void;
      triggerUndo: () => void;
      triggerRedo: () => void;
      openSettings: (type: string) => void;
      loadPersistentStorage: () => Record<string, unknown>;
    };
  }
}
