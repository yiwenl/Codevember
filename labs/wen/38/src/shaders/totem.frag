// totem.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform mat3 invertMVMatrix;
uniform samplerCube texture;
varying vec3 vNormal;

varying vec3 vEye;
varying vec3 vVertex;


float diffuse(vec3 n, vec3 l) {
	return max(dot(n, normalize(l)), 0.0);
}


const vec3 l0 = vec3(1.0);
const vec3 l1 = vec3(-1.0);
const float fade = .92;
const vec3 lc0 = vec3(1.0, 1.0, fade);
const vec3 lc1 = vec3(fade, fade, 1.0);

void main(void) {
	vec3 N = vNormal.grb;
	vec3 d0 = diffuse(N, l0) * lc0;
	vec3 d1 = diffuse(N, l1) * lc1;

	vec3 color = .2 + d0 + d1;

	gl_FragColor = vec4(color, 1.0);
}