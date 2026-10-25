import { CommanderStore } from '../../../store';
import type { Data } from '../../../store';
import { ROOT_SCOPE } from '../../../consts/scopes';
import type {
  CommandContext,
  DispatchFn,
  ThunkFn,
} from '../../hooks/use-commander';

export const runCommand = (
  data: object,
  command: ThunkFn,
  context = {} as CommandContext,
): CommanderStore => {
  const store = new CommanderStore(structuredClone(data) as Data);

  const dispatch: DispatchFn = (commandOrThunk) => {
    if (typeof commandOrThunk === 'function') {
      commandOrThunk(dispatch, (path) => store.get(path), context);
      return;
    }
    store.dispatch({ scope: ROOT_SCOPE, ...commandOrThunk });
  };

  dispatch(command);
  return store;
};
