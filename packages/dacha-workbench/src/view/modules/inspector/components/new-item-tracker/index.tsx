import {
  Children,
  createContext,
  isValidElement,
  useState,
  type FC,
  type Key,
  type ReactNode,
} from 'react';

export const NewItemContext = createContext(false);

export interface NewItemTrackerProps {
  children: ReactNode;
  resetKey?: string;
}

interface SeenItems {
  resetKey?: string;
  isNew: Map<Key, boolean>;
}

const isSameMap = (a: Map<Key, boolean>, b: Map<Key, boolean>): boolean =>
  a.size === b.size &&
  Array.from(a).every(([key, value]) => b.get(key) === value);

export const NewItemTracker: FC<NewItemTrackerProps> = ({
  children,
  resetKey,
}) => {
  const items = Children.toArray(children);
  const keys = items.map((item) => (isValidElement(item) ? item.key : null));

  const [seen, setSeen] = useState<SeenItems>(() => ({
    resetKey,
    isNew: new Map(
      keys.filter((key) => key !== null).map((key) => [key, false]),
    ),
  }));

  const isReset = seen.resetKey !== resetKey;
  const previous = isReset ? new Map<Key, boolean>() : seen.isNew;

  const isNew = new Map<Key, boolean>();
  keys.forEach((key) => {
    if (key !== null) {
      isNew.set(key, previous.get(key) ?? !isReset);
    }
  });

  if (isReset || !isSameMap(isNew, seen.isNew)) {
    setSeen({ resetKey, isNew });
  }

  return (
    <>
      {items.map((item, index) => {
        const key = keys[index];
        return (
          <NewItemContext.Provider
            key={key ?? index}
            value={key !== null && Boolean(isNew.get(key))}
          >
            {item}
          </NewItemContext.Provider>
        );
      })}
    </>
  );
};
