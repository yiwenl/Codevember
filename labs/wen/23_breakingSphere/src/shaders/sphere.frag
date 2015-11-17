// sphere.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;

varying vec3 vNormal;
varying vec3 vVertex;

const float fade = .92;
const float ambient = .2;

const vec3 lightPos0 = vec3(200.0);
const vec3 lightColor0 = vec3(1.0, 1.0, fade);
const float lightWeight0 = .65;

const vec3 lightPos1 = vec3(-200.0, -200.0, 400.0);
const vec3 lightColor1 = vec3(fade, fade, 1.0);
const float lightWeight1 = .5;


vec3 diffuse(vec3 light, vec3 normal, vec3 color, float weight) {
	float lambert = max(dot(normalize(light), normal), 0.0);
	return color * lambert * weight;
}


void main(void) {
	vec3 diff0 = diffuse(lightPos0, vNormal, lightColor0, lightWeight0);
	vec3 diff1 = diffuse(lightPos1, vNormal, lightColor1, lightWeight1);

	vec3 color = ambient + diff0 + diff1;
    gl_FragColor = vec4(color , 1.0);
}