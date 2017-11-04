// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uShadowMatrix;

uniform float uSize;


varying vec2 vTextureCoord;
varying vec3 vNormal;

varying vec4 vShadowCoords[4];
varying vec4 vShadowCoord;

void main(void) {
	vec3 position = aVertexPosition;
	position.xz += uSize;
	vec4 worldPosition = vec4(position, 1.0);

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * worldPosition;
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;

    vShadowCoord = uShadowMatrix * worldPosition;
}