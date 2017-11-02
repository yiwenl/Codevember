// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec4 vShadowCoord;
uniform sampler2D textureDepth;

void main(void) {

	float d = distance(vTextureCoord, vec2(.5));
	d = 1.0 - smoothstep(0.0, 0.5, d);
	d *= 0.5;

	vec4 shadowCoord = vShadowCoord / vShadowCoord.w;
	vec2 uv = shadowCoord.xy;
	float dd = texture2D(textureDepth, uv).r;

	float bias = 0.001;
	float visi = 1.0;
	if(dd < shadowCoord.z - bias) {
		visi = 0.0;
	}

	visi = mix(visi, 1.0, .5);

    gl_FragColor = vec4(vec3(visi) * d, 1.0);
}