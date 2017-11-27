// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

#define uMapSize vec2(1024.0)
#define FOG_DENSITY 0.2
#define NUM_LIGHT {NUM_LIGHT}

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vPosition;
varying vec4 vShadowCoord;
uniform sampler2D textureDepth;
uniform vec4 uLights[NUM_LIGHT];



float rand(vec4 seed4) {
	float dot_product = dot(seed4, vec4(12.9898,78.233,45.164,94.673));
	return fract(sin(dot_product) * 43758.5453);
}

float fogFactorExp2(const float dist, const float density) {
	const float LOG2 = -1.442695;
	float d = density * dist;
	return 1.0 - clamp(exp2(d * d * LOG2), 0.0, 1.0);
}


void main(void) {

	float noiseFloor = rand(vec4(gl_FragCoord.xyyx * 5.0));
	float a = distance(vTextureCoord, vec2(.5)) + noiseFloor * 0.01;
	a = smoothstep(.5, .0, a);
	a = pow(a, 3.0) * 0.74;

	float l = 0.0;
	float d;
	for(int i=0; i<NUM_LIGHT; i++) {
		vec4 light = uLights[i];
		d = distance(vPosition, light.xyz);
		d = smoothstep(light.w * 2.0, light.w, d);
		l += d * 0.1;
	}


	vec4 color = vec4(vec3(a + l), 1.0);

	float fogDistance = gl_FragCoord.z / gl_FragCoord.w;
	float fogAmount = fogFactorExp2(fogDistance - 1.5, FOG_DENSITY);
	const vec4 fogColor = vec4(0.0, 0.0, 0.0, 1.0); // white

	gl_FragColor = mix(color, fogColor, fogAmount);
}