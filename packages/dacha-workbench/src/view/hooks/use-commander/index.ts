import { useContext, useCallback, useRef } from 'react';
import type { ReferenceWalker } from 'dacha';

import { useStore } from '../use-store';
import { CommandScopeContext, SchemasContext } from '../../providers';

export interface DispatchOptions {
  isEffect?: boolean;
}

export interface Command {
  command: string;
  options: unknown;
  isEffect?: boolean;
}

export type GetStateFn = (path: string[]) => unknown;

export interface CommandContext {
  walker: ReferenceWalker;
}

export type ThunkFn = (
  dispatch: DispatchFn,
  getState: GetStateFn,
  context: CommandContext,
) => void;
export type DispatchFn = (commandOrThunkFn: Command | ThunkFn) => void;

export type UseCommanderHook = () => {
  dispatch: DispatchFn;
};

export const useCommander: UseCommanderHook = () => {
  const scope = useContext(CommandScopeContext);

  const store = useStore();

  const { walker } = useContext(SchemasContext);

  const context = useRef<CommandContext>({ walker });
  context.current = { walker };

  const dispatch = useCallback<DispatchFn>(
    (commandOrThunkFn) => {
      if (typeof commandOrThunkFn === 'function') {
        store.batch(() =>
          commandOrThunkFn(
            dispatch,
            (path) => store.get(path),
            context.current,
          ),
        );
        return;
      }

      store.dispatch({
        scope,
        ...commandOrThunkFn,
      });
    },
    [scope, store],
  );

  return { dispatch };
};
