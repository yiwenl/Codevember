// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vNormal;
varying vec2 vTextureCoord;
varying vec4 vShadowCoord;
varying vec3 vPosition;
uniform sampler2D texture;
uniform sampler2D textureDiffuse;
uniform sampler2D textureNormal;


float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}


const vec3 LIGHT = vec3(1.0, .8, .6);

void main(void) {
	vec4 shadowCoord = vShadowCoord / vShadowCoord.w;
	vec4 color = texture2DProj(texture, shadowCoord);
	// vec4 color = texture2D(texture, vTextureCoord);

	if(color.r < .9) {
		discard;
	}	

	vec2 uv = vTextureCoord * 5.0;

	vec3 N = texture2D(textureNormal, uv).rgb;
	N = normalize(vNormal + N * 0.5);

	vec3 colorDiffuse = texture2D(textureDiffuse, uv).rgb;

	float d = diffuse(N, LIGHT);
	d = mix(d, 1.0, .5);

	float hFog = smoothstep(0.0, 0.5, vPosition.y);
	hFog = mix(hFog, 1.0, .5);

    gl_FragColor = vec4(colorDiffuse * d * hFog, 1.0);
    // gl_FragColor = vec4(vNormal * .5 + .5, 1.0);
}