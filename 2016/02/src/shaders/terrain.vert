// terrain.vert


precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform sampler2D textureHeight;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying float vHeight;


#define uMaxHeight 1.0

void main(void) {

	vHeight = texture2D(textureHeight, aTextureCoord).r;
	vec3 position = aVertexPosition;
	position.y -= vHeight * uMaxHeight;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
}