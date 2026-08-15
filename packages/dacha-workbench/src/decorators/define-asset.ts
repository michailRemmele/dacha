import type { Field } from '../types/widget-schema';
import { type Constructor } from '../types/engine';

import { schemaRegistry } from './schema-registry';
import { defineMetaProperty, mergeFields, isEditor } from './utils';

interface DefineAssetOptions {
  name: string;
  fields?: Field[];
}

export function DefineAsset({
  name,
  fields: optionFields,
}: DefineAssetOptions): (constructor: Constructor<unknown>) => void {
  return (constructor: Constructor<unknown>): void => {
    defineMetaProperty(constructor, 'assetName', name);

    if (!isEditor()) {
      return;
    }

    const fields = mergeFields(
      optionFields,
      Reflect.getMetadata('schema:fields', constructor) as Field[] | undefined,
    );

    schemaRegistry.addWidget('asset', name, { fields });
  };
}
