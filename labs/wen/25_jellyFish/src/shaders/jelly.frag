// jelly.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
// varying vec2 vTextureCoord;
uniform sampler2D texture;

const int NUM_DOTS = {{numPoints}};
uniform vec3 points[NUM_DOTS];

varying vec3 vNormal;
varying vec3 vVertex;
const float radius = 100.0;

const float fade = .92;
const vec3 light0 = vec3(200.0);
const vec3 lightColor0 = vec3(1.0, 1.0, fade);
const vec3 light1 = vec3(-200.0, -200.0, 400.0);
const vec3 lightColor1 = vec3(fade, fade, 1.0);
float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

float diffuse(vec3 light, vec3 normal, float weight) {
	float lambert = max(dot(normalize(light), normal), 0.0);
	return lambert * weight;
}

float diffuse(vec3 light, vec3 pos, vec3 normal, float weight) {
	vec3 distToLight = light-pos;
	vec3 dirToLight = normalize(distToLight);
	float dist = length(distToLight);
	float lambert = max(dot(dirToLight, normal), 0.0);

	float offset = 0.0;
	if(dist < radius) {
		offset = 1.0-dist/radius;
	}
	offset = exponentialIn(offset);

	return lambert * weight * offset;
}


void main(void) {

	float grey = 0.0;
	for(int i=0; i<NUM_DOTS; i++) {
		vec3 p = points[i];
		grey += diffuse(p, vVertex, -vNormal, 1.0);
	}

	vec3 d0 = diffuse(light0, vNormal, .25) * lightColor0;
	vec3 d1 = diffuse(light1, vNormal, .15) * lightColor1;
	vec3 color = d0 + d1 + grey;

	float b = length(color) / length(vec3(1.0));
	vec2 uv = vec2(b, .5);
	vec3 colorMap = texture2D(texture, uv).rgb;
	colorMap = mix(colorMap, color, .5);

    gl_FragColor = vec4(colorMap, 1.0);
}