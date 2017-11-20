// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE
#define FOG_DENSITY 0.1

precision highp float;
varying vec2 vTextureCoord;
varying float vLife;
uniform sampler2D texture;

float fogFactorExp2(const float dist, const float density) {
  const float LOG2 = -1.442695;
  float d = density * dist;
  return 1.0 - clamp(exp2(d * d * LOG2), 0.0, 1.0);
}

void main(void) {
	float a = abs(vLife - .5);
	a = smoothstep(.5, .45, a);


	float fogDistance = gl_FragCoord.z / gl_FragCoord.w;
	float fogAmount = fogFactorExp2(fogDistance * .75, FOG_DENSITY);
	vec4 fogColor = vec4(vec3(0.0), 1.0); // white
    vec4 color = vec4(vec3(a), 1.0);
    gl_FragColor = mix(color, fogColor, fogAmount);
}