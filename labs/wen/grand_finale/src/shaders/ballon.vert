// ballon.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 normalMatrix;
uniform float scale;
uniform vec3 position;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vEye;

void main(void) {
	vec3 pos = aVertexPosition * scale + position;
	vec4 mvPosition = uMVMatrix * vec4(pos, 1.0);
    gl_Position = uPMatrix * mvPosition;
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
    vNormal = normalMatrix*normalize(aVertexPosition-vec3(0.0, 50.0, 0.0));
    vEye = normalize(mvPosition.xyz);
}