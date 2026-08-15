import { v4 as uuidv4 } from 'uuid';
import { t } from 'i18next';
import { type ActorConfig } from 'dacha';

import { getUniqueName } from '../../../utils/get-unique-name';
import { getTransformConfig } from '../../../utils/get-transform-config';
import { addValue } from '..';
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander';

export const addActor =
  (destinationPath: string[]) =>
  (dispatch: DispatchFn, getState: GetStateFn): void => {
    const destination = getState(destinationPath) as ActorConfig[];

    dispatch(
      addValue<ActorConfig>(destinationPath, {
        id: uuidv4(),
        name: getUniqueName(
          t('explorer.scenes.actionBar.actor.new.title'),
          destination,
        ),
        components: [getTransformConfig()],
        children: [],
      }),
    );
  };
