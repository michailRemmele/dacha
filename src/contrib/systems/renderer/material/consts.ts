export const DEFAULT_VERTEX_SHADER = `
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
`;

export const DEFAULT_FRAGMENT_SHADER = `
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
`;
