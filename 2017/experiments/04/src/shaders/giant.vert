// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;


void main(void) {
	vec4 worldPosition = uModelMatrix * vec4(aVertexPosition, 1.0);
    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
    vTextureCoord = aTextureCoord;
    vNormal = uNormalMatrix * aNormal;
    vPosition = worldPosition.xyz;
}