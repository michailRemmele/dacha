import { Shader, DefineShader, Texture } from 'dacha';
import type { ShaderTextures } from 'dacha/renderer';

interface MaskedOptions {
  mask: string;
}

const VERTEX = `
  precision mediump float;
  attribute vec2 aPosition;
  attribute vec2 aUV;
  uniform mat3 uProjectionMatrix;
  uniform mat3 uWorldTransformMatrix;
  uniform mat3 uTransformMatrix;
  varying vec2 vUV;
  void main() {
    vUV = aUV;
    mat3 mvp = uProjectionMatrix * uWorldTransformMatrix * uTransformMatrix;
    gl_Position = vec4((mvp * vec3(aPosition, 1.0)).xy, 0.0, 1.0);
  }
`;

const FRAGMENT = `
  precision mediump float;
  varying vec2 vUV;
  uniform sampler2D uSampler;
  uniform sampler2D uMask;
  uniform vec2 uUVOffset;
  uniform vec2 uUVScale;
  uniform float uAlpha;
  void main() {
    vec4 color = texture2D(uSampler, uUVOffset + vUV * uUVScale);
    color *= texture2D(uMask, vUV).a * uAlpha;
    gl_FragColor = color;
  }
`;

@DefineShader({
  name: 'Masked',
  fields: [{ name: 'mask', type: 'asset', kind: 'texture', initialValue: '' }],
})
export default class Masked extends Shader {
  vertex(): string {
    return VERTEX;
  }

  fragment(): string {
    return FRAGMENT;
  }

  textures(textures: ShaderTextures, { mask }: MaskedOptions): void {
    textures.uMask = this.assets.get(Texture, mask)?.resource;
  }
}
