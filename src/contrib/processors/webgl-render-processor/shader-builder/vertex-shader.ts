export const vertexShader = `
attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform mat3 u_modelViewMatrix;
uniform mat3 u_viewMatrix;

varying vec2 v_texCoord;

void main() {
  mat3 matrix = u_viewMatrix * u_modelViewMatrix;
  gl_Position = vec4((matrix * vec3(a_position, 1)).xy, 0, 1);

  v_texCoord = a_texCoord;
}
`;
