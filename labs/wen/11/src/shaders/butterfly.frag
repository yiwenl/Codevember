// butterfly.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vVertex;
uniform vec3 camera;

uniform sampler2D texture;


//	lighting

const float ambient = .35;
const vec3 lightPosition0 = vec3(10.0, 100.0, 10.0);
const float lightWeight0 = 1.25;

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
    vec4 color = texture2D(texture, vTextureCoord);
    if(color.a < .001) discard;

    vec3 L = normalize(lightPosition0 - vVertex);
    vec3 E = normalize(camera - vVertex);

    float diffuse = orenNayarDiffuse(L, E, vNormal, 0.5, lightWeight0);
    color.rgb *= ambient + diffuse;

    // if(color.a < .01) discard;
    gl_FragColor = color;
}