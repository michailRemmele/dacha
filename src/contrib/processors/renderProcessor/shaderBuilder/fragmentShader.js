const fragmentShader = `
precision highp float;

uniform sampler2D u_image;
uniform mat3 u_texMatrix;

varying vec2 v_texCoord;

void main() {
  gl_FragColor = texture2D(u_image, (u_texMatrix * vec3(fract(v_texCoord), 1)).xy);
}
`;

export default fragmentShader;
