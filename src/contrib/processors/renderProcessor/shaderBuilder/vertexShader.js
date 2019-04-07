const vertexShader = `
attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform mat3 u_matrix;

uniform vec2 u_textureAtlasSize;
uniform vec2 u_texCoordTranslation;

varying vec2 v_texCoord;

void main() {
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
  
  vec2 texCoord = a_texCoord + u_texCoordTranslation;
  v_texCoord = texCoord / u_textureAtlasSize;
}
`;

export default vertexShader;
