// ribbon.frag
#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vVertex;
varying float vDepth;
varying float vOpacity;
varying vec3 vNormal;
varying vec3 vExtra;
varying vec3 vColor;

uniform sampler2D textureMap;
uniform float time;


const float fade = .92;
const float ambient = 1.0;
const vec3 light0 = vec3(300.0);
const vec3 light1 = vec3(-300.0);
const vec3 lightColor0 = vec3(1.0, 1.0, fade);
const vec3 lightColor1 = vec3(fade, fade, 1.0);
const vec2 center = vec2(.5);
const float PI = 3.141592657;


const vec3 color0 = vec3(126.0, 127.0, 158.0)/255.0;
const vec3 color1 = vec3(198.0, 181.0, 153.0)/255.0;

vec3 diffuse(vec3 light, vec3 vertex, vec3 normal, vec3 lightColor) {
	vec3 L = normalize(light-vertex);
	float lambert = max(dot(normal, L), 0.0);
	return lightColor0 * lambert;
}

void main(void) {
	if(vOpacity < .01) discard;
	vec3 diff0   = diffuse(light0, vVertex, vNormal, lightColor0) * .35;
	vec3 diff1   = diffuse(light1, vVertex, vNormal, lightColor1) * .15;
	
	vec3 color   = (vColor + diff0 + diff1) * vDepth;

	
	gl_FragColor = vec4(color, vOpacity);
}