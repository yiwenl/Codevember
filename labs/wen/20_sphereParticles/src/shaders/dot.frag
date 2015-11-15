// dot.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;

void main(void) {
    gl_FragColor = texture2D(texture, vTextureCoord);
    gl_FragColor.rgb *= gl_FragColor.a;
    gl_FragColor.rgb *= vec3(1.0, 1.0, .95);
}