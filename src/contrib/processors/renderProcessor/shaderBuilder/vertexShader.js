const vertexShader = `
attribute vec2 a_position;
attribute vec2 a_texCoord;
attribute mat3 a_matrix;

varying vec2 v_position;
varying vec2 v_texCoord;

void main() {
  gl_Position = vec4((a_matrix * vec3(a_position, 1)).xy, 0, 1);

  v_position = a_position;
  v_texCoord = a_texCoord;
}
`;

export default vertexShader;
