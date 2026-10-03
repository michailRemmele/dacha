import { persistentStorage } from '../../../../../persistent-storage';

const STORAGE_KEY = 'inspector.expandedPanels';

type ExpandedPanels = Record<string, true>;

const getExpandedPanels = (): ExpandedPanels =>
  persistentStorage.get<ExpandedPanels | undefined>(STORAGE_KEY) ?? {};

export const isPanelExpanded = (key: string): boolean =>
  Boolean(getExpandedPanels()[key]);

export const setPanelExpanded = (key: string, expanded: boolean): void => {
  const panels = getExpandedPanels();

  if (Boolean(panels[key]) === expanded) {
    return;
  }

  const { [key]: _, ...rest } = panels;
  persistentStorage.set(
    STORAGE_KEY,
    expanded ? { ...rest, [key]: true } : rest,
  );
};
