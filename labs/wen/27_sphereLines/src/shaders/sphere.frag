// sphere.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
uniform sampler2D texture;
varying vec3 vLightPos;

// const vec3 lightPos = vec3(100.0);

const vec3 front = vec3(0.0, 0.0, 1.0);

void main(void) {
	float g = 1.0 - dot(vNormal, front);
	g = pow(g, 2.0);
	float diff = max(dot(normalize(vLightPos), vNormal), 0.0);
	diff = pow(diff, 3.0) * .5;
    gl_FragColor = vec4(vec3(diff)+g, 1.0);
}