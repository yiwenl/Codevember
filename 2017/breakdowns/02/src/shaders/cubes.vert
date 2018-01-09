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

uniform sampler2D depth0;
uniform sampler2D depth1;
uniform float uCubeSize;

varying vec2 vTextureCoord;
varying vec3 vNormal;


float getSurfacePosition(mat4 shadowMatrix, vec3 position, mat4 invertProj, mat4 invertView, sampler2D textureDepth) {
	//	get the shadow coord
	vec4 vShadowCoord = shadowMatrix * vec4(position, 1.0);
	vec4 shadowCoord  = vShadowCoord / vShadowCoord.w;
	vec2 uv = shadowCoord.xy;
	

	//	reconstruct world position from depth buffer
	float depth = texture2D(textureDepth, uv).r;
	float z = depth * 2.0 - 1.0;

	vec4 clipSpacePosition = vec4(uv * 2.0 - 1.0, z, 1.0);
	vec4 viewSpacePosition = invertProj * clipSpacePosition;
	viewSpacePosition /= viewSpacePosition.w;

	vec4 worldSpacePosition = invertView * viewSpacePosition;

	return worldSpacePosition.z;
}

void main(void) {
	vec3 posOffset = aPosOffset;
	
	float z0       = getSurfacePosition(uShadowMatrix0, posOffset, uProjInvert0, uViewInvert0, depth0);
	float z1       = getSurfacePosition(uShadowMatrix1, posOffset, uProjInvert1, uViewInvert1, depth1);

	float scale = 1.0;
	if(posOffset.z < z0 + uCubeSize && posOffset.z > z1 - uCubeSize) {
		scale = 1.0;
	} else {
		scale = 0.05;
	}

	vec3 position = aVertexPosition * scale + aPosOffset;
	gl_Position   = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
	vTextureCoord = aTextureCoord;
	vNormal       = aNormal;
}