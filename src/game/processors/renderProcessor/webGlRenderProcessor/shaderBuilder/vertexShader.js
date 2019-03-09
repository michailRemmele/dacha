const vertexShader = `
attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform vec2 u_resolution;
uniform vec2 u_scale;
uniform vec2 u_textureAtlasSize;

varying vec2 v_texCoord;

void main() {
  vec2 scaledPosition = u_scale * a_position;
  vec2 convertedPosition = (scaledPosition.xy / u_resolution) * 2.0 - 1.0;

  gl_Position = vec4(convertedPosition * vec2(1, -1), 0, 1);
  v_texCoord = a_texCoord / u_textureAtlasSize;
}
`;

export default vertexShader;
