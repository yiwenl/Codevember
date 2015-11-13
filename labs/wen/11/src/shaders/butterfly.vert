// butterfly.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float time;

varying vec2 vTextureCoord;
varying vec3 vVertex;
varying vec3 vNormal;

vec2 rotate(vec2 pos, float angle) {
	float c = cos(angle);
	float s = sin(angle);

	return mat2(c, s, -s, c) * pos;
}

const float PI = 3.141592657;

void main(void) {
	vec3 pos = aVertexPosition;
	float r = sin(pos.z*.02 + time*.75)*.5+.5;
	r = PI*.5 - r * PI * .76 - .1;
	if(pos.x < 0.0) {
		r *= -1.0;
	}
	pos.xy = rotate(pos.xy, r);	
	pos.yz = rotate(pos.yz, -.5);
	
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;

    vec3 N = aNormal;
    N.xy = rotate(N.xy, r);
    vNormal = normalize(N);
    vVertex = pos;
}