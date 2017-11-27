// render.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uShadowMatrix;
uniform sampler2D textureCurr;
uniform sampler2D textureNext;
uniform sampler2D textureExtra;
uniform float percent;
uniform float time;
uniform vec2 uViewport;

varying vec4 vColor;
varying vec3 vExtra;
varying vec3 vNormal;
varying vec4 vShadowCoord;

const float radius = 0.005;
const float PI = 3.141592653;

void main(void) {
	vec2 uv      = aVertexPosition.xy;
	vec3 posCurr = texture2D(textureCurr, uv).rgb;
	vec3 posNext = texture2D(textureNext, uv).rgb;
	vec3 pos     = mix(posCurr, posNext, percent);
	if(posNext.y > posCurr.y) {
		pos = posCurr;
	}
	
	vec3 extra      = texture2D(textureExtra, uv).rgb;
	vec4 wsPosition = uModelMatrix * vec4(pos, 1.0);
	gl_Position     = uProjectionMatrix * uViewMatrix * wsPosition;
	float life = extra.b;


	float size 		 = abs(life - .5);
	size 			 = smoothstep(0.0, 0.5, size);
	size 			 = sin(size * PI);
	
	float a   		 = sin(life* PI);
	float g          = sin(extra.r + time * mix(extra.g, 1.0, .5));
	g                = smoothstep(0.0, 1.0, g);
	g                = mix(g, 1.0, .75);
	vColor           = vec4(vec3(g) * a, a);
	
	float distOffset = uViewport.y * uProjectionMatrix[1][1] * radius / gl_Position.w;

	
	gl_PointSize     = distOffset * (1.0 + extra.x * 1.0) * size;
	
	vNormal          = aNormal;
	vShadowCoord     = uShadowMatrix * wsPosition;
	vExtra           = extra;
}