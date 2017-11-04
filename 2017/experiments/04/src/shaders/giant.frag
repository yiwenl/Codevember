// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;
uniform sampler2D texture;
uniform vec3 uLightPos;




float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}


const vec3 LIGHT = vec3(1.0, .8, .6);


void main(void) {

	

	vec3 N = normalize(uLightPos - vPosition);
	float d = diffuse(N, LIGHT);
	// d = mix(d, 1.0, .5);


	vec3 color = texture2D(texture, vTextureCoord).rgb;
	color *= d;


    gl_FragColor = vec4(color, 1.0);
}