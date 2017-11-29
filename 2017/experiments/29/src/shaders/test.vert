// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;
uniform float uSize;

varying vec2 vTextureCoord;
varying vec3 vNormal;

varying vec3 vOldPos;
varying vec3 vNewPos;

void main(void) {
	vec3 position = aVertexPosition;

	float d = length(position.xz);

	float waveHeight = smoothstep(uSize, 0.0, d);

	float offset = sin(d * 10.0 * aExtra.z - uTime + aExtra.g * 10.0);
	vec2 dir = normalize(position.xz);
	position.xz = dir * (d + offset * .1 * waveHeight);
	position *= aExtra.x;

	position += aPosOffset;

	position.y *= 0.0;


    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;


    vOldPos = aVertexPosition;
    vNewPos = position;
}