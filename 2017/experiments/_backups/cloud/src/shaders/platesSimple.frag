// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;

uniform mat4 uShadowMatrix0;
uniform mat4 uShadowMatrix1;

uniform sampler2D textureTop;
uniform sampler2D textureBottom;
uniform vec3 uLightPos;


varying vec3 vNormal;
varying vec4 vWsPosition;
varying vec3 vPosition;

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
	// if(vNormal.y == 0.0) {
	// 	discard;
	// }

	float d = diffuse(vNormal, uLightPos);
	d = mix(d, 1.0, .5);


	vec4 color = vec4(vec3(d), 1.0);
	vec4 colorTop = getPosition(uShadowMatrix0, textureTop, vPosition.xyz);
	vec4 colorBottom = getPosition(uShadowMatrix1, textureBottom, vPosition.xyz);



	if(vNormal.y > 0.0) {
		color.a *= colorTop.a;
	} else {
		color.a *= colorBottom.a;
	}


	float a = 0.0;
	if(vWsPosition.y > colorBottom.y && vWsPosition.y < colorTop.y) {
		a = 1.0;
	}

	color.a *= a;

	if(color.a <= 0.0) {
		discard;
	}

    gl_FragColor = color;
}