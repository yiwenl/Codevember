// render.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aPosOffset;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform mat3 uModelViewMatrixInverse;

uniform sampler2D textureCurr;
uniform sampler2D textureNext;
uniform sampler2D textureExtra;
uniform sampler2D textureNormal;
uniform float percent;
uniform float time;


varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vWsNormal;
varying vec2 vTextureCoord;
varying vec3 vPosition;
varying vec3 vWsPosition;
varying vec3 vEyePosition;

const float radius = 0.01;

const vec3 FRONT = vec3(0.0, 0.0, 1.0);

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

void main(void) {
	vec2 uv        = aPosOffset.xy;
	vec3 posCurr   = texture2D(textureCurr, uv).rgb;
	vec3 posNext   = texture2D(textureNext, uv).rgb;
	vec3 posOffset = mix(posCurr, posNext, percent);
	vec3 extra     = texture2D(textureExtra, uv).rgb;
	vec3 normal    = texture2D(textureNormal, uv).rgb * 2.0 - 1.0;
	float scale    = mix(extra.r, 1.0, .25) * 0.5;


	vec3 axis 	   = normalize(cross(normal, FRONT));
	float angle    = acos(dot(normal, FRONT));
	
	vec3 position  = aVertexPosition * scale;
	position.z 	   *= (1.0 + extra.z * 3.0) * 3.0;
	position 	   = rotate(position, axis, angle);
	position       += posOffset;
	// gl_Position    = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);

	vec4 worldSpacePosition	= uModelMatrix * vec4(position, 1.0);
    vec4 viewSpacePosition	= uViewMatrix * worldSpacePosition;
    vPosition				= viewSpacePosition.xyz;
	vWsPosition				= worldSpacePosition.xyz;
	vec4 eyeDirViewSpace	= viewSpacePosition - vec4( 0, 0, 0, 1 );
	vEyePosition			= -vec3( uModelViewMatrixInverse * eyeDirViewSpace.xyz );
	gl_Position				= uProjectionMatrix * viewSpacePosition;
	
	vNormal        = aNormal;
	vColor 		   = vec3(extra.b * 0.05, extra.b * 0.05, extra.b * 0.065);
	vWsNormal      = rotate(aNormal, axis, angle);
	vTextureCoord  = aTextureCoord;
}