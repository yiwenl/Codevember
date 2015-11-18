precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 vColor;

void main(void) {
	vec3 pos = vec3(aTextureCoord, 0.0);
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vColor = vec4(aVertexPosition, 1.0);
    gl_PointSize = 1.0;
}