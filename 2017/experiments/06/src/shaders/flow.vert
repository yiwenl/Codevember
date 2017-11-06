// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aPosOffset;
attribute vec3 aNormal;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;
uniform float uRange;

varying vec2 vTextureCoord;
varying vec3 vNormal;

void main(void) {
	vec3 position = aVertexPosition * mix(aExtra.x, 1.0, .5);
	position += aPosOffset;
	float d = aPosOffset.z + aExtra.y + aExtra.z * uTime;
	d = mod(d + uRange, uRange * 2.0) - uRange;
	position.z += d;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
}