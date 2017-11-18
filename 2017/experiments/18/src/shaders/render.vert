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
uniform sampler2D textureMap;
uniform sampler2D textureColor;
uniform float percent;
uniform float time;
uniform float uLength;
uniform vec2 uViewport;

varying vec4 vColor;
varying vec3 vNormal;

const float radius = 0.005;

void main(void) {
	vec2 uv      = aVertexPosition.xy;
	vec3 posCurr = texture2D(textureCurr, uv).rgb;
	vec3 posNext = texture2D(textureNext, uv).rgb;
	vec3 pos     = mix(posCurr, posNext, percent);
	vec3 extra   = texture2D(textureExtra, uv).rgb;
	vec3 color  = texture2D(textureColor, uv).rgb;
	
	vec4 screenPosition = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
	gl_Position  = screenPosition;
	screenPosition = screenPosition/screenPosition.w;
	vec2 uvScreen = screenPosition.xy * .5 + .5;

	float t = texture2D(textureMap, uvScreen).b;

	float a = 1.0;
	if(posNext.z < posCurr.z) {
		a = 0.0;
	}

	a *= 1.0 - t;
	float tt = abs(pos.z);
	tt = smoothstep(uLength, uLength - 1.0, tt);
	a *= tt;

	float g 	 = sin(extra.r + time * mix(extra.b, 1.0, .5));
	g 			 = smoothstep(0.0, 1.0, g);
	g 			 = mix(g, 1.0, .75);
	vColor       = vec4(color * g, a);

	float distOffset = uViewport.y * uProjectionMatrix[1][1] * radius / gl_Position.w;
    gl_PointSize = distOffset * (1.0 + extra.x * 0.25);

	vNormal 	 = aNormal;
}