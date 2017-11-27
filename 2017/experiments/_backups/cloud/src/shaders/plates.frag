// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;

uniform mat4 uShadowMatrix0;
uniform mat4 uShadowMatrix1;

uniform sampler2D textureTop;
uniform sampler2D textureBottom;
uniform sampler2D textureShadow;
uniform vec3 uLightPos;


varying vec3 vNormal;
varying vec4 vWsPosition;
varying vec3 vPosition;
varying vec4 vShadowCoord;


#define uMapSize vec2(1024.0)
#define FOG_DENSITY 0.2

float rand(vec4 seed4) {
	float dot_product = dot(seed4, vec4(12.9898,78.233,45.164,94.673));
	return fract(sin(dot_product) * 43758.5453);
}


float PCFShadow(sampler2D depths, vec2 size, vec4 shadowCoord) {
	float result = 0.0;
	float bias = 0.005;
	vec2 uv = shadowCoord.xy;

	for(int x=-1; x<=1; x++){
		for(int y=-1; y<=1; y++){
			vec2 off = vec2(x,y) + rand(vec4(gl_FragCoord.xy, float(x), float(y)));
			off /= size;

			float d = texture2D(depths, uv + off).r;
			if(d < shadowCoord.z - bias) {
				result += 1.0;
			}

		}
	}
	return 1.0 -result/9.0;

}


float fogFactorExp2(const float dist, const float density) {
	const float LOG2 = -1.442695;
	float d = density * dist;
	return 1.0 - clamp(exp2(d * d * LOG2), 0.0, 1.0);
}


vec4 getPosition(mat4 shadowMatrix, sampler2D texPosition, vec3 position) {
	vec4 shadowCoord = shadowMatrix * vec4(position, 1.0);
	shadowCoord = shadowCoord/shadowCoord.w;
	vec2 uv = shadowCoord.xy;
	return texture2D(texPosition, uv);
}

float diffuse(vec3 N, vec3 L) {
	return max(dot(N, normalize(L)), 0.0);
}


vec3 diffuse(vec3 N, vec3 L, vec3 C) {
	return diffuse(N, L) * C;
}




void main(void) {

	float d = diffuse(vNormal, uLightPos);
	vec4 color = vec4(vec3(d), 1.0);
	vec4 colorTop = getPosition(uShadowMatrix0, textureTop, vPosition.xyz);
	vec4 colorBottom = getPosition(uShadowMatrix1, textureBottom, vPosition.xyz);

	// if(vNormal.y > 0.0) {
	// 	color.a *= colorTop.a;
	// } else {
	// 	color.a *= colorBottom.a;
	// }


	float a = 0.0;
	if(vWsPosition.y > colorBottom.y && vWsPosition.y < colorTop.y) {
		a = 1.0;
	}

	color.a *= a;

	if(color.a <= 0.0) {
		discard;
	}


	vec4 shadowCoord = vShadowCoord / vShadowCoord.w;
	float s = PCFShadow(textureShadow, uMapSize, shadowCoord);

	color.rgb *= s;
	color.rgb = mix(color.rgb, vec3(1.0), .5);

    gl_FragColor = color;
}