// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;
attribute vec3 aExtra;


uniform mat4 uShadowMatrix0;
uniform mat4 uShadowMatrix1;
uniform mat4 uProjInvert0;
uniform mat4 uProjInvert1;
uniform mat4 uViewInvert0;
uniform mat4 uViewInvert1;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D depth0;
uniform sampler2D depth1;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform float uTime;
uniform float uRange;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vExtra;


float getDistToCamera(mat4 shadowMatrix, sampler2D texture, vec3 position, mat4 invertProj, mat4 invertView, sampler2D textureDepth, inout float outside) {
	vec4 vShadowCoord = shadowMatrix * vec4(position, 1.0);
	vec4 shadowCoord  = vShadowCoord / vShadowCoord.w;
	vec2 uv = shadowCoord.xy;
	vec4 color = texture2D(texture, uv);
	if(color.a <=0.0) {
		outside = 0.0;
	}
	float depth = texture2D(textureDepth, uv).r;
	float z = depth * 2.0 - 1.0;

	vec4 clipSpacePosition = vec4(uv * 2.0 - 1.0, z, 1.0);
    vec4 viewSpacePosition = invertProj * clipSpacePosition;
    viewSpacePosition /= viewSpacePosition.w;

    vec4 worldSpacePosition = invertView * viewSpacePosition;

    return worldSpacePosition.z;
}

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}


void main(void) {
	vec3 posOffset = aPosOffset;
	posOffset.x -= aExtra.x + uTime * mix(aExtra.y, 1.0, .15);
	posOffset.x = mod(posOffset.x + uRange, uRange * 2.0) - uRange;

	float outside = 1.0;
	float z0 = getDistToCamera(uShadowMatrix0, texture0, posOffset, uProjInvert0, uViewInvert0, depth0, outside);
	float z1 = getDistToCamera(uShadowMatrix1, texture1, posOffset, uProjInvert1, uViewInvert1, depth1, outside);

	float scale = 1.0;
	if(outside < 0.5) {
		scale = 0.0;
	} else {
		if(posOffset.z < z0 && posOffset.z > z1) {
			scale = 1.0;
		} else {
			scale = 0.0;
		}

	}

	scale = mix(scale, 1.0, .03);

	vec3 axis = normalize(aExtra);
	float a = aExtra.y + uTime * mix(aExtra.z, 1.0, .5) * 5.0;
	// a *= 0.0;

	vec3 position = aVertexPosition * mix(aExtra, vec3(1.0), .25) * scale;
	position = rotate(position, axis, a);
	position += posOffset;


    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = rotate(aNormal, axis, a);
    vExtra = aExtra;
}