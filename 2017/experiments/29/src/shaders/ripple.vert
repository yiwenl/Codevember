// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform float uScale;
uniform float uTime;
uniform vec3 uPosition;
uniform vec3 uExtra;

varying vec2 vTextureCoord;
varying vec3 vNormal;

varying vec3 vOldPos;
varying vec3 vNewPos;

void main(void) {
	vec3 position = aVertexPosition * uScale;
	float d = length(position.xz);
	float waveHeight = smoothstep(uScale, 0.0, d);

	float offset = sin(d * 5.0 * uExtra.z - uTime + uExtra.g * 10.0);
	vec2 dir = normalize(position.xz);
	position.xz = dir * (d + offset * .1 * waveHeight);
	position += uPosition;


    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;

    vOldPos = aVertexPosition * uScale;
    vNewPos = position;
}