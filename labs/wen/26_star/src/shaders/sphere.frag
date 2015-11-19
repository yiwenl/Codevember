// sphere.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
// varying vec2 vTextureCoord;
// uniform sampler2D texture;

varying vec3 vNormal;
const vec3 front = vec3(0.0, 0.0, 1.0);

void main(void) {

	float g = max(dot(front, vNormal), 0.0);
	g = smoothstep(.1, 1.0, g);
	g = pow(1.0 - g, 3.0) * 1.0;

    gl_FragColor = vec4(vec3(g), 1.0);
}