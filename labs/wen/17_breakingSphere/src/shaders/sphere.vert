// sphere.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aNormal;
attribute vec3 aCenter;
// attribute vec3 aBefore;
// attribute vec3 aCurrent;
// attribute vec3 aAfter;
attribute vec3 aExtra;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec3 avoid;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vEye;

const float R = 100.0;
const float maxRange = 1.0;

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

vec3 getPosition(vec3 p, vec3 c) {
	float l = distance(c, avoid);
	if(l < R) {
		float scale = exponentialIn(l/R);
		vec3 relativePos = p-c;
		vec3 dir = normalize(c - avoid);
		vec3 newC = avoid + dir * R + (1.0 + aExtra.x*.5);
		return newC + relativePos*scale;
	} else {
		return p;
	}
}


void main(void) {
	vec3 pos      = getPosition(aVertexPosition, aCenter);
	vec4 mvPos    = uMVMatrix * vec4(pos, 1.0);
	gl_Position   = uPMatrix * mvPos;
	vTextureCoord = aTextureCoord;
	vEye          = normalize(mvPos.xyz);
	vNormal       = aNormal;
	// vNormal 	  = normalize(pos);
}