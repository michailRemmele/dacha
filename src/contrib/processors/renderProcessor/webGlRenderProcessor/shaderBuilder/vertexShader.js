const vertexShader = `
attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform vec2 u_resolution;
uniform vec2 u_scale;
uniform vec2 u_translation;

uniform vec2 u_textureAtlasSize;
uniform vec2 u_texCoordTranslation;

varying vec2 v_texCoord;

void main() {
  vec2 position = a_position + u_translation;
  vec2 scaledPosition = u_scale * position;
  vec2 convertedPosition = (scaledPosition.xy / u_resolution) * 2.0 - 1.0;

  gl_Position = vec4(convertedPosition * vec2(1, -1), 0, 1);
  
  vec2 texCoord = a_texCoord + u_texCoordTranslation;
  v_texCoord = texCoord / u_textureAtlasSize;
}
`;

export default vertexShader;
