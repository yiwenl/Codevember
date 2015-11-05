// sphere.frag

precision highp float;

uniform vec3 eye;
uniform sampler2D texture;

varying vec3 vNormal;
varying vec3 vVertex;


const int NUM_PARTICLES = {{NUM_PARTICLES}};
uniform vec3 particles[NUM_PARTICLES];
uniform vec3 colors[NUM_PARTICLES];

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

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

float exponentialOut(float t) {
  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}


const vec3 lightPos0 = vec3(105.0);
const vec3 lightColor0 = vec3(1.0, 1.0, .96);
const float lightWeight0 = .35;

const vec3 lightPos1 = vec3(-195.0, -195.0, 0.0);
const vec3 lightColor1 = vec3(.96, .96, 1.0);
const float lightWeight1 = .25;

const vec3 color0 = vec3(19.0, 19.0, 28.0)/255.0;
const vec3 color1 = vec3(1.0);

void main(void) {

	vec3 diff0 = diffuse(vNormal, lightPos0, vVertex, lightColor0) * lightWeight0;
	vec3 diff1 = diffuse(vNormal, lightPos1, vVertex, lightColor1) * lightWeight1;	

	vec3 lightParticle = vec3(.0);
	float minRadius = 250.0;
	float lightWeight = .15;
	for(int i=0; i<NUM_PARTICLES; i++) {
		vec3 light = particles[i];
		float d = distance(light, vVertex);
		
		if(d < minRadius) {
			float dOffset = (1.0 - d/minRadius);
			dOffset = exponentialIn(dOffset);
			lightParticle += diffuse(vNormal, light, vVertex, colors[i]) * dOffset * lightWeight;
		}
		
	}

	lightParticle = min(lightParticle, vec3(1.0));

	vec3 color = diff0 + diff1 + lightParticle;
	float l = length(color) / length(vec3(1.0));
	// l = pow(l, 2.0);
	// l = exponentialOut(l);
	// color = mix(color0, color1, l);

	color = texture2D(texture, vec2(l, .5)).rgb;

	gl_FragColor = vec4(color, 1.0);
}