// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform float uLineWidth;

uniform sampler2D textureHeight;
uniform sampler2D textureNormal;

varying vec2 vTextureCoord;
varying vec3 vNormal;

void main(void) {
	vec3 position = aVertexPosition;
	vec3 normal = texture2D(textureNormal, aTextureCoord).rgb * 2.0 - 1.0;
	position.y = texture2D(textureHeight, aTextureCoord).r * 1.5;
	position += normal * uLineWidth;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
}