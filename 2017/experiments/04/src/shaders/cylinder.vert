// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uShadowMatrix;
uniform mat3 uNormalMatrix;

uniform float uRotation;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec4 vShadowCoord;
varying vec3 vPosition;

void main(void) {
	vec3 position = aVertexPosition;
	gl_Position   = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
	vTextureCoord = aTextureCoord;
	vNormal       = uNormalMatrix * aNormal;
	vPosition 	  = position;

    vShadowCoord = uShadowMatrix * vec4(position, 1.0);
}