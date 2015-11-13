// line.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float time;
uniform float freq;
uniform float waveHeight;
uniform float z;

varying vec2 vTextureCoord;

const float PI = 3.141592657;

void main(void) {
	vec3 pos = aVertexPosition;
	pos.y = sin((pos.x - time) * freq) * waveHeight;
	pos.z = z;
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
}