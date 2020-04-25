const vertexShader = `
attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform mat3 u_modelViewMatrix;

uniform mat3 u_projectMatrix;
uniform mat3 u_zoomMatrix;
uniform mat3 u_cameraMatrix;

varying vec2 v_texCoord;

void main() {
  mat3 u_Matrix = u_projectMatrix * u_zoomMatrix * u_cameraMatrix * u_modelViewMatrix;
  gl_Position = vec4((u_Matrix * vec3(a_position, 1)).xy, 0, 1);

  v_texCoord = a_texCoord;
}
`;

export default vertexShader;
