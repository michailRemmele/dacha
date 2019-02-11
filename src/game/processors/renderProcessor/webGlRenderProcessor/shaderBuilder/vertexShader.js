const vertexShader = `
attribute vec4 a_position;
attribute vec2 a_texCoord;

uniform vec2 u_resolution;

varying vec2 v_texCoord;

void main() {
  vec2 convertedPosition = (a_position.xy / u_resolution) * 2.0 - 1.0;

  gl_Position = vec4(convertedPosition * vec2(1, -1), 0, 1);
  v_texCoord = a_texCoord;
}
`;

export default vertexShader;
