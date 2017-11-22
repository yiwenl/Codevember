precision highp float;

#define FOG_DENSITY 0.1

varying vec3 vNormal;
varying vec3 vCenter;
varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec2 vUVOffset;
varying vec2 vUVScale;

uniform vec3 uLightPos;
uniform sampler2D texture;
uniform sampler2D textureNormal;
uniform float maxRadius;

float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}


float fogFactorExp2(const float dist, const float density) {
	const float LOG2 = -1.442695;
	float d = density * dist;
	return 1.0 - clamp(exp2(d * d * LOG2), 0.0, 1.0);
}


void main(void) {
	vec2 uv = vTextureCoord * vUVScale + vUVOffset;
	vec3 colorPaper = texture2D(textureNormal, vTextureCoord).rgb * (1.0 + vColor.r * .2);

	float d = diffuse(vNormal, uLightPos);
	d = mix(d, 1.0, .5);

	float a = abs(vCenter.x);
	a = smoothstep(maxRadius, maxRadius - 2.0, a);


	vec3 color = texture2D(texture, uv).rgb * colorPaper;

	float fogDistance = gl_FragCoord.z / gl_FragCoord.w;
	float fogAmount = fogFactorExp2(fogDistance * .75, FOG_DENSITY);
	vec3 fogColor = vec3(0.0); 

	color = mix(color * d, fogColor, fogAmount);

    gl_FragColor = vec4(color, a);
}