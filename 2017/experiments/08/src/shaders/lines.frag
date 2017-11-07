// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;

uniform float uRange;
uniform vec3 uColor;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vAlpha;

float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}


const vec3 LIGHT = vec3(-0.5, 1.0, 0.0);

void main(void) {
	if( vAlpha <= 0.0) {
		discard;
	}

	float d = diffuse(vNormal, LIGHT);
	d = mix(d, 1.0, .25);

    gl_FragColor = vec4(vec3(d), 1.0);
    gl_FragColor.rgb *= uColor;
}