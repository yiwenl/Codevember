// sphere.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;

uniform sampler2D texture;

uniform	vec3 camera;
varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vEye;


float orenNayarDiffuse(vec3 lightDirection,	vec3 viewDirection,	vec3 surfaceNormal,	float roughness, float albedo) {
	float LdotV = dot(lightDirection, viewDirection);
	float NdotL = dot(lightDirection, surfaceNormal);
	float NdotV = dot(surfaceNormal, viewDirection);

	float s = LdotV - NdotL * NdotV;
	float t = mix(1.0, max(NdotL, NdotV), step(0.0, s));

	float sigma2 = roughness * roughness;
	float A = 1.0 + sigma2 * (albedo / (sigma2 + 0.13) + 0.5 / (sigma2 + 0.33));
	float B = 0.45 * sigma2 / (sigma2 + 0.09);

	return albedo * max(0.0, NdotL) * (A + B * s / t) / 3.14159265;
}


const float fade = .96;

const vec3 lightDirection0 = vec3(100.0);
const vec3 lightColor0 = vec3(1.0, 1.0, fade);
const float lightWeight0 = 1.0;

const vec3 lightDirection1 = vec3(-100.0, -100.0, 20.0);
const vec3 lightColor1 = vec3(fade, fade, 1.0);
const float lightWeight1 = 0.5;

vec3 envLight(vec3 normal, vec3 dir) {
	vec3 eye   = -dir;
	vec3 r     = reflect( eye, normal );
	float m    = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
	vec2 vN    = r.xy / m + .5;
	vN.y       = 1.0 - vN.y;
	vec3 color = texture2D( texture, vN ).rgb;
    return color;
}



void main(void) {
	vec3 color = vec3(0.3);

	vec3 L0 = normalize(lightDirection0);
	vec3 L1 = normalize(lightDirection1);
	vec3 E = normalize(camera);

	float diffuse0 = orenNayarDiffuse(L0, E, vNormal, 1.0, lightWeight0);
	float diffuse1 = orenNayarDiffuse(L1, E, vNormal, 3.0, lightWeight1);
	// vec3 env = envLight(vNormal, vEye);
	color += diffuse0 * lightColor0 + diffuse1 * lightColor1;
	// color = env;

    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(vNormal * .5 + .5, 1.0);
}