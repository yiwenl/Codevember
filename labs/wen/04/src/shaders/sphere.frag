// sphere.frag

precision highp float;

uniform vec3 eye;

varying vec3 vNormal;
varying vec3 vVertex;


vec3 diffuse(vec3 normal, vec3 light, vec3 color) {
	vec3 L = normalize(light);
	float lambert = max(dot(normal, L), 0.0);
	return color * lambert;
}


vec3 diffuse(vec3 normal, vec3 light, vec3 pos, vec3 color) {
	vec3 dirToLight = light - pos;
	return diffuse(normal, dirToLight, color);
}


vec3 specular(vec3 normal, vec3 light, vec3 eye, vec3 vertex, vec3 color, float shiness) {
	vec3 dirLight = normalize(light - vertex);
	vec3 dirEye = normalize(eye - vertex);
	vec3 lightReflect = normalize(reflect(-dirLight, normal));
	float lambert = max(dot(dirEye, lightReflect), 0.0);
	return pow(lambert, shiness) * color;
}

vec3 specular(vec3 normal, vec3 light, vec3 eye, vec3 vertex, vec3 color) {
	return specular(normal, light, eye, vertex, color, 40.0);
}


const vec3 lightPos0 = vec3(105.0);
const vec3 lightColor0 = vec3(1.0, 1.0, .96);
const float lightWeight0 = .25;

const vec3 lightPos1 = vec3(-195.0);
const vec3 lightColor1 = vec3(.96, .96, 1.0);
const float lightWeight1 = .15;

void main(void) {

	vec3 diff0 = diffuse(vNormal, lightPos0, vVertex, lightColor0) * lightWeight0;
	vec3 diff1 = diffuse(vNormal, lightPos1, vVertex, lightColor1) * lightWeight1;	

	vec3 color = diff0 + diff1;

	gl_FragColor = vec4(color, 1.0);
}