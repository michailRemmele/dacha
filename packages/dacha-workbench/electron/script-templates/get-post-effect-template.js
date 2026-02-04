const getPostEffectTemplate = (name) => `import { PostEffect } from 'dacha';
import { DefinePostEffect } from 'dacha-workbench/decorators';
import { BlurFilter } from 'pixi.js';

interface ${name}Options {
  strength: number;
  quality: number;
}

@DefinePostEffect({
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
export default class ${name} extends PostEffect {
  create({ strength, quality }: ${name}Options): BlurFilter {
    return new BlurFilter({ strength, quality });
  }
}
`;

module.exports = getPostEffectTemplate;
