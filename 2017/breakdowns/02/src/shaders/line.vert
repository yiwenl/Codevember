// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uPoint0;
uniform vec3 uPoint1;

varying vec2 vTextureCoord;
varying vec3 vNormal;

void main(void) {
	vec3 position = mix(uPoint0, uPoint1, aVertexPosition.x);
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
}