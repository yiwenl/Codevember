// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D textureNormal;

void main(void) {
    gl_FragColor = texture2D(textureNormal, vTextureCoord);
    gl_FragColor.rgb = gl_FragColor.rrr;
}