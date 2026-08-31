import { useContext } from 'react';

import { SchemasContext } from '../../providers';

export const useEditorReady = (): boolean => {
  const { isReady } = useContext(SchemasContext);

  return isReady;
};
