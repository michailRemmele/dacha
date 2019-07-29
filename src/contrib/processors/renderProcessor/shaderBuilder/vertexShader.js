const vertexShader = `
attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform mat3 u_matrix;

uniform vec2 u_texCoordTranslation;
uniform vec2 u_textureAtlasSize;
uniform vec2 u_textureSize;
uniform vec2 u_quadSize;

varying vec2 v_texCoord;
varying vec2 v_texCoordTranslation;
varying vec2 v_textureAtlasSize;
varying vec2 v_textureSize;
varying vec2 v_quadSize;

void main() {
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);

  v_texCoord = a_texCoord;
  v_texCoordTranslation = u_texCoordTranslation;
  v_textureAtlasSize = u_textureAtlasSize;
  v_textureSize = u_textureSize;
  v_quadSize = u_quadSize;
}
`;

export default vertexShader;
