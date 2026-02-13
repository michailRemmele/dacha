const getFilterEffectTemplate = (name) => `import { FilterEffect } from 'dacha';
import { DefineFilterEffect } from 'dacha-workbench/decorators';
import { BlurFilter } from 'pixi.js';

interface ${name}Options {
  strength: number;
  quality: number;
}

@DefineFilterEffect({
  name: '${name}',
  fields: [
    {
      name: 'strength',
      type: 'number',
    },
    {
      name: 'quality',
      type: 'number',
    },
  ],
})
export default class ${name} extends FilterEffect {
  create({ strength, quality }: ${name}Options): BlurFilter {
    return new BlurFilter({ strength, quality });
  }
}
`;

module.exports = getFilterEffectTemplate;
