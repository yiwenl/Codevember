// reflect.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform vec3 camera;

varying vec2 vTextureCoord;
varying vec3 vEye;
varying vec3 vNormal;

void main(void) {
	vec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
	gl_Position     = uPMatrix * mvPosition;
	vTextureCoord   = aTextureCoord;
	// vNormal         = normalize(normalMatrix*aNormal);
	vNormal         = aNormal;
	vEye            = normalize(mvPosition.xyz);
}