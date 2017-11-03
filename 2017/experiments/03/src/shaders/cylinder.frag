// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vNormal;
varying vec4 vShadowCoord;
uniform sampler2D texture;
uniform sampler2D texturePortrait;

uniform float uRatio;
uniform float uRatioPortrail;

float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}


const vec3 LIGHT = vec3(1.0, .2, -.6);

void main(void) {
	vec4 shadowCoord = vShadowCoord / vShadowCoord.w;
	vec2 uv = shadowCoord.xy;

	// vec3 color = texture2D(texturePortrait, uv).rgb;
	vec3 color = texture2DProj(texturePortrait, shadowCoord).rgb;


	float d = diffuse(vNormal, LIGHT);
	d = mix(d, 1.0, .5);
	color *= d;

    gl_FragColor = vec4(color, 1.0);
}