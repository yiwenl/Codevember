// totem.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 normalMatrix;
uniform mat3 nMtx;
uniform float scale;
uniform float ry;
uniform float time;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vVertex;

varying vec3 vEye;

vec2 rotate(vec2 v, float a) {
	float c = cos(a);
	float s = sin(a);
	mat2 r = mat2(c, -s, s, c);
	return r * v;
}

void main(void) {
	vec3 pos        = aVertexPosition * scale;
	pos.y 			-= 10.0;
	float t 		= sin(time) * .5 + .5;
	t 				= smoothstep(.5, 1.0, t);
	pos.xy 			= rotate(pos.xy, t * 0.02);
	pos.xz 			= rotate(pos.xz, ry);

	vec4 mvPosition = uMVMatrix * vec4(pos, 1.0);
	gl_Position     = uPMatrix * mvPosition;
	vTextureCoord   = aTextureCoord;
	
	vVertex         = pos;

	vec3 N 			= aNormal;
	N.xz 			= rotate(N.xz, ry);
	vNormal         = normalMatrix * N;
	vEye            = normalize(mvPosition.xyz);
}