// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D textureIn;
uniform sampler2D textureOut;
uniform sampler2D textureMap;
uniform sampler2D textureNormal;
uniform sampler2D texturePosition;
uniform samplerCube textureEnv;

uniform float gamma;
uniform float exposure;

float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}


const float A = 0.15;
const float B = 0.50;
const float C = 0.10;
const float D = 0.20;
const float E = 0.02;
const float F = 0.30;

vec3 Uncharted2Tonemap( vec3 x )
{
	return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;
}

vec3 colorCorrection( vec3 color ) {
	color = Uncharted2Tonemap( color * exposure );
	color = color * ( 1.0 / Uncharted2Tonemap( vec3( 20.0 ) ) );
	color = pow( color, vec3( 1.0 / gamma ) );

	return color;
}

void main(void) {

	vec4 colorMap = texture2D(textureMap, vTextureCoord);

	vec3 colorIn = texture2D(textureIn, vTextureCoord).rgb;
	vec3 N = texture2D(textureNormal, vTextureCoord).rgb;
	vec3 reflectionIn = colorCorrection(textureCube( textureEnv, -N ).rgb);
	colorIn *= reflectionIn;

	vec3 colorOut = texture2D(textureOut, vTextureCoord).rgb;
	vec3 reflection = colorCorrection(textureCube( textureEnv, N ).rgb);

	colorOut += reflection * .25 * colorMap.z;

	
	vec3 color = mix(colorIn, colorOut, 1.0 -colorMap.r);



    gl_FragColor = vec4(color, 1.0);
}