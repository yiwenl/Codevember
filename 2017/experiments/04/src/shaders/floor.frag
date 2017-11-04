// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vNormal;
varying vec2 vTextureCoord;
varying vec4 vShadowCoord;
uniform sampler2D textureDiffuse;
uniform sampler2D textureNormal;
uniform sampler2D texture;


float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}


const vec3 LIGHT = vec3(1.0, .8, .6);

void main(void) {

	vec4 shadowCoord = vShadowCoord / vShadowCoord.w;

	float d = distance(vTextureCoord, vec2(0.0, 1.0));

	float dd = smoothstep(0.15, 0.1, d);
	d = 1.0 - smoothstep(0.0, 1.0, d);
	vec3 color = texture2DProj(texture, shadowCoord).rgb;

	vec2 uv = vTextureCoord * 5.0;

	vec3 N = texture2D(textureNormal, uv).rgb;
	N = normalize(vNormal + N * 0.5);

	vec3 colorDiffuse = texture2D(textureDiffuse, uv).rgb;
	colorDiffuse *= mix((1.0 - dd), 1.0, .65);

	vec3 finalColor = (colorDiffuse + ( 1.0 - color) * (1.0 - dd) * 0.75) * d;

    gl_FragColor = vec4(finalColor, d);
}