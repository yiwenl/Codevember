// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec3 vNormal;
varying vec4 vShadowCoord;
uniform sampler2D texture;
uniform sampler2D texturePortrait;

uniform float uRatio;
uniform float uRatioPortrail;

float contrast(float mValue, float mScale, float mMidPoint) {
	return clamp( (mValue - mMidPoint) * mScale + mMidPoint, 0.0, 1.0);
}

float contrast(float mValue, float mScale) {
	return contrast(mValue,  mScale, .5);
}

vec2 contrast(vec2 mValue, float mScale, float mMidPoint) {
	return vec2( contrast(mValue.r, mScale, mMidPoint), contrast(mValue.g, mScale, mMidPoint));
}

vec2 contrast(vec2 mValue, float mScale) {
	return contrast(mValue, mScale, .5);
}


void main(void) {
	vec4 shadowCoord = vShadowCoord / vShadowCoord.w;
	vec2 uv = shadowCoord.xy;

	// vec3 color = texture2D(texturePortrait, uv).rgb;
	vec3 color = texture2DProj(texturePortrait, shadowCoord).rgb;
    gl_FragColor = vec4(color, 1.0);
}