// ribbon.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;

void main(void) {
	float a = smoothstep(0.0, .2, vTextureCoord.x);
    gl_FragColor = vec4(1.0, 1.0, 0.96, a);
}