// ballon.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
// varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform float opacity;
uniform vec3 color;
varying vec3 vNormal;
varying vec3 vEye;



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

vec3 env(sampler2D t) {
	vec3 r = reflect( vEye, vNormal );
    float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
    vec2 vN = r.xy / m + .5;

    return texture2D( t, vN ).rgb;
}

void main(void) {
	if(opacity <= .01) discard;

	vec3 envLight = env(texture) * .35;
    vec3 diff0 = diffuse(lightPos0, vNormal, lightColor0, lightWeight0) * .1;
	vec3 diff1 = diffuse(lightPos1, vNormal, lightColor1, lightWeight1) * .1;

	vec3 finalColor = color + diff0 + diff1 + envLight;
    gl_FragColor = vec4(finalColor , 1.0) * opacity;
    // gl_FragColor = vec4(vNormal * .5 + .5 , 1.0);
}