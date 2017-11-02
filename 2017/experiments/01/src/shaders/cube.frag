// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vNormal;
varying vec4 vShadowCoord;
uniform sampler2D textureDepth;
uniform vec3 lightPos;

float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}

void main(void) {
	float d = diffuse(vNormal, lightPos);
	d = mix(d, 1.0, .5);

	vec4 shadowCoord = vShadowCoord / vShadowCoord.w;
	vec2 uv = shadowCoord.xy;
	float dd = texture2D(textureDepth, uv).r;

	float bias = 0.001;
	float visi = 1.0;
	if(dd < shadowCoord.z - bias) {
		visi = 0.0;
	}

	visi = mix(visi, 1.0, .75);

    gl_FragColor = vec4(vec3(d * visi), 1.0);
}