// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uCameraPos;
uniform samplerCube texture;

uniform float		uExposure;
uniform float		uGamma;



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

void main(void) {

	float d            = distance(vTextureCoord.xy, vec2(1.0, 0.0));
	d                  = smoothstep(1.0, 0.5, d);
	vec3 cameraDir     = normalize(uCameraPos - vPosition);
	vec3 reflectionVec = normalize(reflect(vNormal, cameraDir));
	
	vec3 color         = textureCube(texture, reflectionVec).rgb;
	
	
	color              = Uncharted2Tonemap( color * uExposure );
	color              = color * ( 1.0 / Uncharted2Tonemap( vec3( 20.0 ) ) );
	color              = pow( color, vec3( 1.0 / uGamma ) );


	float t 		   = 1.0 - vTextureCoord.y;
	t 				   = mix(t, 1.0, .1);
	
	gl_FragColor       = vec4(color, mix(d, t, .5));
	// gl_FragColor       = vec4(color, d);
}