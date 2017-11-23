// render.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform mat3 uModelViewMatrixInverse;

uniform sampler2D texturePos;
uniform sampler2D textureVel;
uniform sampler2D textureExtra;
uniform sampler2D textureLife;
uniform float time;
uniform vec2 uViewport;

varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWsPosition;
varying vec3 vEyePosition;
varying vec3 vWsNormal;

const float radius = 0.0075;

void main(void) {
	vec2 uv      = aVertexPosition.xy;
	vec3 pos 	 = texture2D(texturePos, uv).rgb;
	vec3 vel 	 = texture2D(textureVel, uv).rgb;
	vec3 life 	 = texture2D(textureLife, uv).rgb;
	vec3 extra   = texture2D(textureExtra, uv).rgb;
	vColor       = vec4(life * 2.0 - 1.0, extra.b);

	vec4 worldSpacePosition	= uModelMatrix * vec4(pos, 1.0);
	vec4 viewSpacePosition	= uViewMatrix * worldSpacePosition;
	
	vNormal					= uNormalMatrix * aNormal;
	vPosition				= viewSpacePosition.xyz;
	vWsPosition				= worldSpacePosition.xyz;
	
	vec4 eyeDirViewSpace	= viewSpacePosition - vec4( 0, 0, 0, 1 );
	vEyePosition			= -vec3( uModelViewMatrixInverse * eyeDirViewSpace.xyz );
	vWsNormal				= normalize( uModelViewMatrixInverse * vNormal );
	
	gl_Position				= uProjectionMatrix * viewSpacePosition;


	float distOffset = uViewport.y * uProjectionMatrix[1][1] * radius / gl_Position.w;
	gl_PointSize = distOffset * (1.0 + extra.x * 1.0) * life.x;
}
