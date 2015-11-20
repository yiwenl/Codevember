// sphere.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
uniform sampler2D texture;


const vec3 lightPos = vec3(100.0);

void main(void) {
	float diff = max(dot(normalize(lightPos), vNormal), 0.0);
	diff = pow(diff, 3.0);
    gl_FragColor = vec4(diff * .75);
}