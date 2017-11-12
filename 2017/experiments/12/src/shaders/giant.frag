// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uColor;



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


float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}

const vec3 LIGHT = vec3(1.0, .8, .5);

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

void main(void) {
	vec3 pos = vPosition;

	float d = diffuse(vNormal, LIGHT);
	d = mix(d, 1.0, .5) * 0.025;
	d *= 1.0 - uColor.r;

	float outside = 1.0;
	float z0 = getDistToCamera(uShadowMatrix0, texture0, pos, uProjInvert0, uViewInvert0, depth0, outside);
	float z1 = getDistToCamera(uShadowMatrix1, texture1, pos, uProjInvert1, uViewInvert1, depth1, outside);
	float alpha = 1.0;

	if(outside > 0.5) {
		if(pos.z < z0 || pos.z > z1) {
			alpha = 0.0;
		} else {
			alpha = 1.0;
		}

		alpha = 1.0;
	} else {
		alpha = 0.0;
	}

	alpha = mix(alpha, 1.0, .2);

    gl_FragColor = vec4((uColor + d) * alpha, alpha);
}