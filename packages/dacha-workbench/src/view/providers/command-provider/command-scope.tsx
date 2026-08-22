import React, { useEffect, useContext, FC, ReactElement } from 'react';

import { ROOT_SCOPE } from '../../../consts/scopes';

import { CommandContext } from './command-provider';

interface CommandScopeProps {
  name?: string;
  children: ReactElement | ReactElement[];
}

export const CommandScopeContext = React.createContext<string>(ROOT_SCOPE);

export const CommandScopeProvider: FC<CommandScopeProps> = ({
  name = ROOT_SCOPE,
  children,
}): ReactElement => {
  const { store, setActiveScope } = useContext(CommandContext);

  useEffect(() => {
    setActiveScope(name);

    return (): void => {
      setActiveScope(ROOT_SCOPE);
    };
  }, [name]);

  useEffect(
    () => (): void => {
      store.clear({ scope: name });
    },
    [],
  );

  return (
    <CommandScopeContext.Provider value={name}>
      {children}
    </CommandScopeContext.Provider>
  );
};
