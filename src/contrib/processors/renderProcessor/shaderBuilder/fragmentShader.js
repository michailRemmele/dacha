const fragmentShader = `
precision highp float;

uniform sampler2D u_image;
uniform vec2 u_texAtlasSize;

varying vec2 v_texCoord;
varying vec2 v_texSize;
varying vec2 v_texTranslate;
varying vec2 v_gameObjectSize;

float calculateCoord(float gameObjectSize, float texSize, float texTranslate, float texCoord) {
  if (gameObjectSize > texSize) {
    float repeat = gameObjectSize / texSize;
    return mod(texCoord * repeat, texSize) + texTranslate;
  } else {
    return texCoord + texTranslate;
  }
}

void main() {
  vec2 texCoord = vec2(
    calculateCoord(v_gameObjectSize.x, v_texSize.x, v_texTranslate.x, v_texCoord.x),
    calculateCoord(v_gameObjectSize.y, v_texSize.y, v_texTranslate.y, v_texCoord.y)
  );

  gl_FragColor = texture2D(u_image, texCoord / u_texAtlasSize);
}
`;

export default fragmentShader;
