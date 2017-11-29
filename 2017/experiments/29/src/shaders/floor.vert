// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uPosOffset;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;

void main(void) {

	vec3 position    = aVertexPosition + uPosOffset;
	vPosition 		 = position;
	vec4 vWsPosition = uModelMatrix * vec4(position, 1.0);
	gl_Position      = uProjectionMatrix * uViewMatrix * vWsPosition;
	vTextureCoord    = aTextureCoord;
	vNormal          = aNormal;
    
}