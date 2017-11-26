// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vNormal;
uniform vec3 uLightPos;
uniform vec3 uColor;

float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}

void main(void) {

	float d = diffuse(vNormal, uLightPos);
	d = mix(d, 1.0, .75);

    gl_FragColor = vec4(uColor * d, 1.0);
}