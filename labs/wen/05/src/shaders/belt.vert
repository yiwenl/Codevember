// belt.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform sampler2D textureHeight;
uniform sampler2D textureNormal;
uniform float uvy;
uniform float height;
uniform vec3 position;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vVertex;

void main(void) {
	vec3 pos = aVertexPosition;
	vec2 uv = vec2(aTextureCoord.x, uvy);
	float h = texture2D(textureHeight, uv).r;
	pos.y = h * height + 50.0;
	pos += position;
	vNormal = texture2D(textureNormal, uv).rgb * 2.0 - 1.0;

    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vVertex = pos;
}