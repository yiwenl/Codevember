// render.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform sampler2D texturePos;
uniform sampler2D textureVel;
uniform sampler2D textureExtra;
uniform sampler2D textureLife;
uniform sampler2D textureMap;
uniform float time;
uniform vec2 uViewport;

varying vec4 vColor;
varying vec3 vNormal;

const float radius = 0.0025;

vec4 getScreenPosition(vec3 pos) {
	return uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
}


void main(void) {
	vec2 uv             = aVertexPosition.xy;
	vec3 pos            = texture2D(texturePos, uv).rgb;
	vec3 vel            = texture2D(textureVel, uv).rgb;
	vec3 extra          = texture2D(textureExtra, uv).rgb;
	vec3 life           = texture2D(textureLife, uv).rgb;
	
	vec4 screenPosition = getScreenPosition(pos);
	
	gl_Position         = screenPosition;
	
	screenPosition      = screenPosition/screenPosition.w;
	vec2 uvScreen       = screenPosition.xy * .5 + .5;
	
	float map           = texture2D(textureMap, uvScreen).r;
	
	
	float g             = sin(extra.r + time * mix(extra.g, 1.0, .5));
	g                   = smoothstep(0.0, 1.0, g);
	g                   = mix(g, 1.0, .85) * mix(extra.b, 1.0, .75);
	vColor              = vec4(vec3(g), map * 0.15);
	
	float distOffset    = uViewport.y * uProjectionMatrix[1][1] * radius / gl_Position.w;
	gl_PointSize        = distOffset * (1.0 + extra.x * 1.0) * map;
	
	vNormal             = aNormal;
}