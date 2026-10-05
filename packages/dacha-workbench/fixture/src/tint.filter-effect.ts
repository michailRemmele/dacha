import { FilterEffect, DefineFilterEffect } from 'dacha';
import { Filter } from 'pixi.js';

@DefineFilterEffect({
  name: 'Tint',
  fields: [{ name: 'color', type: 'color', initialValue: '#ff0000' }],
})
export default class Tint extends FilterEffect {
  create(): Filter {
    return new Filter({});
  }
}
