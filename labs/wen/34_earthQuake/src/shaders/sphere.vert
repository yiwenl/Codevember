// sphere.vert
#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float offset;
uniform float size;

varying vec2 vTextureCoord;

const float PI = 3.141592657;

vec3 getSpherePosition(vec3 value) {
	vec3 pos;
	float rx = value.y/(value.z*.5) * PI - PI * .5;
	float ry = -value.x/value.z * PI * 2.0;
	float r  = cos(rx) * size;
	pos.y    = sin(rx) * size;
	pos.x    = cos(ry) * r;
	pos.z    = sin(ry) * r;
	return pos;
}

vec3 getFloorPosition(vec3 value) {
	vec3 pos;
	pos.x = -size + (value.x/value.z)*size*2.0;
	pos.y = -size/2.0 + (value.y/(value.z*.5))*size;
	pos *= 2.0;

	return pos;
}

void main(void) {
	vec3 posSphere = getSpherePosition(aVertexPosition);
	vec3 posFloor = getFloorPosition(aVertexPosition);
	vec3 pos = mix(posSphere, posFloor, offset);
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
}