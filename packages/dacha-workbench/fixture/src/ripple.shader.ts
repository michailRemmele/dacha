import { Shader, DefineShader } from 'dacha';

@DefineShader({
  name: 'Ripple',
  fields: [{ name: 'frequency', type: 'number', initialValue: 2 }],
})
export default class Ripple extends Shader {
  vertex(): string {
    return '';
  }

  fragment(): string {
    return '';
  }
}
