// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uShadowMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec4 vWsPosition;
varying vec3 vPosition;
varying vec4 vShadowCoord;

void main(void) {

	vec3 position = aPosOffset + aVertexPosition;
	vWsPosition   = uModelMatrix * vec4(position, 1.0);
	
	vPosition     = vec3(aVertexPosition.x, aPosOffset.y, aVertexPosition.z);
	
	gl_Position   = uProjectionMatrix * uViewMatrix * vWsPosition;
	vTextureCoord = aTextureCoord;
	vNormal       = aNormal;

	vShadowCoord  = uShadowMatrix * vWsPosition;
}