// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform float uRange;

void main(void) {
	// const float r = .02;
	float d = smoothstep(0.5 - uRange, 0.5 + uRange, vTextureCoord.y);
	gl_FragColor = vec4(vec3(d), 1.0);
}



/*

const float r = .025;
float d = smoothstep(0.25 - r, 0.25 + r, abs(vTextureCoord.x - 0.5));
gl_FragColor = vec4(vec3(d), 1.0);

*/