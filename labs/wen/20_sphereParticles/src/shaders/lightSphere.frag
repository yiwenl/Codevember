// lightSphere.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vVertex;
uniform vec3 camera;
uniform sampler2D texture;

const vec3 lightPosition0 = vec3(200.0, 150.0, 300.0);
const vec3 lightPosition1 = vec3(-200.0, -200.0, 50.0);


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

void main(void) {

	vec3 L0 = normalize(lightPosition0-vVertex);
	vec3 L1 = normalize(lightPosition1-vVertex);
	vec3 E = normalize(camera - vVertex);

	float diffuse0 = orenNayarDiffuse(L0, E, vNormal, 5.0, 1.0);
	diffuse0 = smoothstep(.35, 1.0, diffuse0);
	diffuse0 = pow(diffuse0, 4.0);

	float diffuse1 = orenNayarDiffuse(L1, E, vNormal, 5.0, 1.0);
	diffuse1 = smoothstep(.35, 1.0, diffuse1);
	// diffuse1 = pow(diffuse1, 4.0);

    gl_FragColor = vec4(diffuse0+diffuse1);
}