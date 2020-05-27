const vertexShader = `
attribute vec2 a_position;
attribute vec2 a_texCoord;

attribute mat3 a_modelViewMatrix;

attribute vec2 a_texSize;
attribute vec2 a_texTranslate;
attribute vec2 a_gameObjectSize;

uniform mat3 u_viewMatrix;

varying vec2 v_texCoord;
varying vec2 v_texSize;
varying vec2 v_texTranslate;
varying vec2 v_gameObjectSize;

void main() {
  mat3 matrix = u_viewMatrix * a_modelViewMatrix;
  gl_Position = vec4((matrix * vec3(a_position, 1)).xy, 0, 1);

  v_texCoord = a_texCoord;
  v_texSize = a_texSize;
  v_texTranslate = a_texTranslate;
  v_gameObjectSize = a_gameObjectSize;
}
`;

export default vertexShader;
