precision highp float;
uniform sampler2D reflTexture;

varying vec2 vTextureCoord;

void main(void) {
    gl_FragColor = texture2D(reflTexture, vec2(vTextureCoord.s, vTextureCoord.t));
    // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}