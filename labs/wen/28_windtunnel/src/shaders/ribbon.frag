// ribbon.frag
#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vVertex;
varying float vDepth;
varying float vOpacity;
varying vec3 vNormal;


const float fade = .92;
const float ambient = .2;
const vec3 light0 = vec3(300.0);
const vec3 light1 = vec3(-300.0);
const vec3 lightColor0 = vec3(1.0, 1.0, fade);
const vec3 lightColor1 = vec3(fade, fade, 1.0);
const vec2 center = vec2(.5);
const float PI = 3.141592657;

vec3 diffuse(vec3 light, vec3 vertex, vec3 normal, vec3 lightColor) {
	vec3 L = normalize(light-vertex);
	float lambert = max(dot(normal, L), 0.0);
	return lightColor0 * lambert;
}

void main(void) {
	if(vOpacity < .01) discard;
	vec3 diff0 = diffuse(light0, vVertex, vNormal, lightColor0) * .75;
	vec3 diff1 = diffuse(light1, vVertex, vNormal, lightColor1) * .5;

	vec3 color = (ambient + diff0 + diff1) * vDepth;

	float d = sin(vTextureCoord.y * PI);
	// float dy = sin(vTextureCoord.y * PI);
	// float d = min(dx , dy);
	d = smoothstep(0.0, .46, d);
	d = mix(d, 1.0, .9);

    gl_FragColor = vec4(color*d, vOpacity);
    // gl_FragColor = vec4(vec3(vDepth), vOpacity);
}