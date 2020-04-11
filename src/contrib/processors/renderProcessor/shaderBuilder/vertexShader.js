const vertexShader = `
attribute vec2 a_position;
attribute vec2 a_texCoord;
attribute mat3 a_matrix;
attribute mat3 a_texMatrix;

varying vec2 v_texCoord;
varying mat3 v_texMatrix;

void main() {
  gl_Position = vec4((a_matrix * vec3(a_position, 1)).xy, 0, 1);

  v_texCoord = a_texCoord;
  v_texMatrix = a_texMatrix;
}
`;

export default vertexShader;
