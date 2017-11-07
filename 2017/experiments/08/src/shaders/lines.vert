// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aUVOffset;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D texture4;
uniform sampler2D texture5;
uniform sampler2D texture6;
uniform sampler2D texture7;
uniform sampler2D texture8;
uniform sampler2D texture9;
uniform sampler2D texture10;
uniform sampler2D texture11;
uniform sampler2D texture12;
uniform sampler2D texture13;
uniform sampler2D texture14;
uniform sampler2D texture15;

uniform float uRange;
uniform float num;
uniform float uLineWidth;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vAlpha;

vec3 getPosition(float index, inout float alpha) {
	vec3 pos;
	if(index < 1.0) {
		pos = texture2D(texture0, aUVOffset.xy).xyz;
	} else if(index < 2.0) {
		pos = texture2D(texture1, aUVOffset.xy).xyz;
	} else if(index < 3.0) {
		pos = texture2D(texture2, aUVOffset.xy).xyz;
	} else if(index < 4.0) {
		pos = texture2D(texture3, aUVOffset.xy).xyz;
	} else if(index < 5.0) {
		pos = texture2D(texture4, aUVOffset.xy).xyz;
	} else if(index < 6.0) {
		pos = texture2D(texture5, aUVOffset.xy).xyz;
	} else if(index < 7.0) {
		pos = texture2D(texture6, aUVOffset.xy).xyz;
	} else if(index < 8.0) {
		pos = texture2D(texture7, aUVOffset.xy).xyz;
	} else if(index < 9.0) {
		pos = texture2D(texture8, aUVOffset.xy).xyz;
	} else if(index < 10.0) {
		pos = texture2D(texture9, aUVOffset.xy).xyz;
	} else if(index < 11.0) {
		pos = texture2D(texture10, aUVOffset.xy).xyz;
	} else if(index < 12.0) {
		pos = texture2D(texture11, aUVOffset.xy).xyz;
	} else if(index < 13.0) {
		pos = texture2D(texture12, aUVOffset.xy).xyz;
	} else if(index < 14.0) {
		pos = texture2D(texture13, aUVOffset.xy).xyz;
	} else if(index < 15.0) {
		pos = texture2D(texture14, aUVOffset.xy).xyz;
	} else {
		pos = texture2D(texture15, aUVOffset.xy).xyz;
	} 

	if(abs(pos.z) > uRange - 1.0) {
		alpha = 0.0;
	}

	return pos;
}

const float PI = 3.141592653;

void main(void) {
	float alpha = 1.0;
	vec3 posOffset = getPosition(aTextureCoord.y, alpha);
	float s = sin(PI * aTextureCoord.y/num) * (1.0 + aUVOffset.z * .42);

	vec3 position  = aVertexPosition + aNormal * uLineWidth;

	position  	   = position * vec3(s, s, 0.2 + aUVOffset.z * .3) + posOffset;
	gl_Position    = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
	vTextureCoord  = aTextureCoord;
	vNormal        = aNormal;
	vPosition      = position;
	vAlpha         = alpha;
}