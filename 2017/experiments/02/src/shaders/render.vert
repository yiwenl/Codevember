// render.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform sampler2D textureCurr;
uniform sampler2D textureNext;
uniform sampler2D textureExtra;
uniform float percent;
uniform float time;
uniform vec2 uViewport;

uniform sampler2D textureHeight;

varying vec4 vColor;
varying vec3 vNormal;
varying vec2 vUV;
varying vec3 vPosition;

const float radius = 0.005;

const float RANGE = 5.0;
const float MAX_DIST = 1.0;

void main(void) {
	vec2 uv      = aVertexPosition.xy;
	vec3 posCurr = texture2D(textureCurr, uv).rgb;
	vec3 posNext = texture2D(textureNext, uv).rgb;
	vec3 pos     = mix(posCurr, posNext, percent);
	vec3 extra   = texture2D(textureExtra, uv).rgb;

	vec2 mapUV = pos.xz / vec2(RANGE) * .5 + .5;
	float height = texture2D(textureHeight, mapUV).r;

	pos.y = height * 2.0;
	vPosition    = pos;
	gl_Position  = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
	

	float alpha = 1.0;
	if(posCurr.x - posNext.x > MAX_DIST) {
		alpha = 0.0;
	}


	float g 	 = sin(extra.r + time * mix(extra.b, 1.0, .5));
	g 			 = smoothstep(0.0, 1.0, g);
	g 			 = mix(g, 1.0, .5);
	vColor       = vec4(vec3(g), alpha);

	float distOffset = uViewport.y * uProjectionMatrix[1][1] * radius / gl_Position.w;
    gl_PointSize = distOffset * (0.5 + extra.x * 2.0);

	vNormal 	 = aNormal;
	vUV 		 = mapUV;
}