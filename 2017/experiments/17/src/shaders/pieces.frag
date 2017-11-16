// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vExtra;
varying vec4 vShadowCoord;

uniform sampler2D texture;
uniform vec3 uLightPos;
uniform float uThreshold;

float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}

void main(void) {
	vec4 shadowCoord = vShadowCoord / vShadowCoord.w;

	vec2 uv = shadowCoord.xy * .5 + .5;
	vec4 color = texture2DProj(texture, shadowCoord);
	if(color.r > uThreshold) {
		discard;
	}

	float d = diffuse(vNormal, uLightPos);
	// d = mix(d, 1.0, .5) * vExtra.g* .15;
	d = vExtra.g* .15;
	// d *= 0.1;

    gl_FragColor = vec4(vec3(d), 1.0);
}