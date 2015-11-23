// ribbon.frag
#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vVertex;
varying float vDepth;
varying float vOpacity;
varying vec3 vNormal;
varying vec3 vExtra;

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
	vec3 diff0   = diffuse(light0, vVertex, vNormal, lightColor0) * .85;
	vec3 diff1   = diffuse(light1, vVertex, vNormal, lightColor1) * .75;
	
	vec3 color   = (ambient + diff0 + diff1 + sin(time*2.0*vExtra.z) * .5) * vDepth;

	vec2 uv = vExtra.xy;
	uv.x = mod(uv.x+time*.1, 1.0);
	vec3 colorMap = texture2D(textureMap, uv).rgb;
	color *= colorMap;
	
	float d      = sin(vTextureCoord.y * PI);
	d            = smoothstep(0.0, .46, d);
	d            = mix(d, 1.0, .9);

	color 		 *= d;
	float l 	 = length(color) / length(vec3(1.0));
	vec3 colorGrd = mix(color0, color1, l);
	color 		 = mix(color, colorGrd, .5);
	
	gl_FragColor = vec4(color*d, vOpacity);
}