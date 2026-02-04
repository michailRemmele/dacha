const getShaderTemplate = (name) => `import { Shader } from 'dacha';
import { DefineShader } from 'dacha-workbench/decorators';

@DefineShader({
  name: '${name}',
})
export default class ${name} extends Shader {
  vertex(): string {
    return \`
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
        vec3 pos = mvp * vec3(aPosition, 1.0);
        gl_Position = vec4(pos.xy, 0.0, 1.0);
      }
    \`;
  }

  fragment(): string {
    return \`
      precision mediump float;

      varying vec2 vUV;

      uniform sampler2D uSampler;
      uniform vec3 uTint;
      uniform float uAlpha;

      void main() {
        vec4 color = texture2D(uSampler, vUV);
        color.rgb *= uTint;
        color *= uAlpha;
        gl_FragColor = color;
      }
    \`;
  }
}
`;

module.exports = getShaderTemplate;
