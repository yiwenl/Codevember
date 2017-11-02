// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uShadowMatrix;

uniform sampler2D texturePortrait;
uniform float uRatio;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec4 vShadowCoord;

void main(void) {
	vec3 position  = aVertexPosition;
	position.y 	   *= 1.0 + aExtra.y * 2.0;
	position.xz    *= 1.0 + aExtra.x;
	vec3 targetPos = position + aPosOffset;
	
	vShadowCoord   = uShadowMatrix * vec4(targetPos, 1.0);
	vec2 uv        = (vShadowCoord/vShadowCoord.w).xy;
	
	float t        = (uRatio - 1.0) * 0.5;
	uv.x           /= (1.0 + t);
	vec3 color     = texture2D(texturePortrait, uv).rgb;
	position.xz    *= color.r;
	position       += aPosOffset;
	
	
	gl_Position    = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
	vTextureCoord  = aTextureCoord;
	vNormal        = aNormal;
}