// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;
attribute vec3 aExtra;
attribute vec4 aRotation;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform mat3 uModelViewMatrixInverse;

uniform float uOffset;
uniform float uTime;
uniform vec3 uHit;
uniform float uRadius;

varying vec2 vTextureCoord;
varying vec3 vPosition;
varying vec3 vPosOffset;
varying vec3 vNormal;
varying vec3 vWsPosition;
varying vec3 vEyePosition;
varying vec3 vWsNormal;

varying vec4 vRotation;
varying vec3 vExtra;

const float PI = 3.141592653;

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


vec3 rotate(vec3 v) {
	float dist = distance(aPosOffset, uHit);
	dist = smoothstep(uRadius*0.5, uRadius, dist);
	float angle = aRotation.w + mix(aExtra.x, 1.0, .5) * uTime;
	angle = mod(angle, PI * 2.0) * uOffset * dist;
	return rotate(v, aRotation.xyz, angle);
}


void main(void) {
	vec3 posRelative        = aVertexPosition - aPosOffset;
	vec3 position           = aPosOffset + rotate(posRelative);
	
	vec4 worldSpacePosition = uModelMatrix * vec4(position, 1.0);
	vec4 viewSpacePosition  = uViewMatrix * worldSpacePosition;
	
	vNormal                 = uNormalMatrix * aNormal;
	vWsPosition             = worldSpacePosition.xyz;
	
	vec4 eyeDirViewSpace    = viewSpacePosition - vec4( 0, 0, 0, 1 );
	vEyePosition            = -vec3( uModelViewMatrixInverse * eyeDirViewSpace.xyz );
	vWsNormal               = normalize( uModelViewMatrixInverse * vNormal );
	
	gl_Position             = uProjectionMatrix * viewSpacePosition;
	
	vTextureCoord           = aTextureCoord;
	vPosition               = aVertexPosition;
	vPosOffset              = aPosOffset;
	vRotation				= aRotation;
	vExtra 					= aExtra;
}