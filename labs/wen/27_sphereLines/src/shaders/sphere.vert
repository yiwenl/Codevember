// sphere.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 normalMatrix;
uniform vec3 lightPos;
uniform float time;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vLightPos;

const float maxRadius = 200.0;

void main(void) {
	vec3 pos = aVertexPosition;

	float d = distance(pos, lightPos);
	if(d < maxRadius) {
		vec3 dir = normalize(pos - lightPos);
		float offset = 1.0 - d/maxRadius;
		pos += dir * offset*30.0 + sin(time);
	}


	gl_Position   = uPMatrix * uMVMatrix * vec4(pos, 1.0);
	vTextureCoord = aTextureCoord;
	vNormal       = normalMatrix*normalize(aVertexPosition);
	vLightPos     = lightPos;
}