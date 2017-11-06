// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform mat4 uShadowMatrix0;
uniform mat4 uShadowMatrix1;
uniform mat4 uProjInvert0;
uniform mat4 uProjInvert1;
uniform mat4 uViewInvert0;
uniform mat4 uViewInvert1;

uniform sampler2D texture0;
uniform sampler2D texture1;

varying vec2 vTextureCoord;
varying vec3 vNormal;


float getDistToCamera(mat4 shadowMatrix, sampler2D texture, vec3 position) {
	vec4 vShadowCoord = shadowMatrix * vec4(position, 1.0);
	vec4 shadowCoord  = vShadowCoord / vShadowCoord.w;
	vec2 uv           = shadowCoord.xy;

	return texture2D(texture, uv).r;
}

void main(void) {
	// vec3 position = aVertexPosition + aPosOffset;
	// float d0 = getDistToCamera(uShadowMatrix0, texture0, aPosOffset);
	// float d1 = getDistToCamera(uShadowMatrix1, texture1, aPosOffset);

	// vec3 posOffset = aPosOffset;
	// posOffset.z = d0;
	// vec3 position = aVertexPosition + posOffset;
	vec4 vShadowCoord = uShadowMatrix0 * vec4(aPosOffset, 1.0);
	vec4 shadowCoord  = vShadowCoord / vShadowCoord.w;
	vec2 uv = shadowCoord.xy;
	float depth = texture2D(texture0, uv).r;
	float z = depth * 2.0 - 1.0;

	vec4 clipSpacePosition = vec4(uv * 2.0 - 1.0, z, 1.0);
    vec4 viewSpacePosition = uProjInvert0 * clipSpacePosition;
    viewSpacePosition /= viewSpacePosition.w;

    vec4 worldSpacePosition = uViewInvert0 * viewSpacePosition;
    vec3 posOffset = aPosOffset;
    posOffset.z = worldSpacePosition.z;
    vec3 position = aVertexPosition + posOffset;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
}