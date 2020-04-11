const fragmentShader = `
precision highp float;

uniform sampler2D u_image;

varying vec2 v_texCoord;
varying mat3 v_texMatrix;

void main() {
  gl_FragColor = texture2D(u_image, (v_texMatrix * vec3(v_texCoord, 1)).xy);
}
`;

export default fragmentShader;
