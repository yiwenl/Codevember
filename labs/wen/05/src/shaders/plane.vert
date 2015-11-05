// plane.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec3 position;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vVertex;

void main(void) {
	vec3 pos = aVertexPosition + position;
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;

    vNormal = normalize(aNormal);
    vVertex = pos;
}