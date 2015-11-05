// belt.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
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


const float ambient = .2;

const vec3 lightPos0 = vec3(150.0*2.0, 300.0*2.0, 0.0);
const vec3 lightColor0 = vec3(1.0, 1.0, .96);
const float lightWeight0 = 1.00;

const vec3 lightPos1 = vec3(-295.0, 0.0, -295.0);
const vec3 lightColor1 = vec3(.96, .96, 1.0);
const float lightWeight1 = .0; 

const vec3 lightPos2 = vec3(0.0, 195.0, 0.0);
const vec3 lightColor2 = vec3(1.0);
const float lightWeight2 = .0; 

void main(void) {
	vec3 diff0 = diffuse(vNormal, lightPos0, vVertex, lightColor0) * lightWeight0;
	vec3 diff1 = diffuse(vNormal, lightPos1, vVertex, lightColor1) * lightWeight1;	
	vec3 diff2 = diffuse(vNormal, lightPos2, vVertex, lightColor2) * lightWeight2;	

	vec3 color = vec3(ambient) + diff0 + diff1 + diff2;

    gl_FragColor = vec4(color, 1.0);
}