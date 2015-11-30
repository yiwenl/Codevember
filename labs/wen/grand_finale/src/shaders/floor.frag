// floor.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
// uniform sampler2D texture;

void main(void) {
	vec4 color = vec4(1.0);
	float d = distance(vTextureCoord, vec2(.5));
	float a = 1.0 - smoothstep(0.0, 0.5, d);
    gl_FragColor = color * a;
}
