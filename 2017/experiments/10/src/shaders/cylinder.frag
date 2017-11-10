// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying float vIndex;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D texture4;
uniform sampler2D texture5;
uniform sampler2D texture6;
uniform sampler2D texture7;


uniform float uSaturation;

vec3 getColor() {
	vec3 color;
	if(vIndex < 1.0) {
		color = texture2D(texture0, vTextureCoord).rgb;
	} else if(vIndex < 2.0) {
		color = texture2D(texture1, vTextureCoord).rgb;
	} else if(vIndex < 3.0) {
		color = texture2D(texture2, vTextureCoord).rgb;
	} else if(vIndex < 4.0) {
		color = texture2D(texture3, vTextureCoord).rgb;
	} else if(vIndex < 5.0) {
		color = texture2D(texture4, vTextureCoord).rgb;
	} else if(vIndex < 6.0) {
		color = texture2D(texture5, vTextureCoord).rgb;
	} else if(vIndex < 7.0) {
		color = texture2D(texture6, vTextureCoord).rgb;
	} else {
		color = texture2D(texture7, vTextureCoord).rgb;
	} 

	return color;
}


float luma(vec3 color) {
	return dot(color, vec3(0.299, 0.587, 0.114));
}

void main(void) {
	vec3 color = getColor();
	float grey = luma(color);
	color = mix(vec3(grey), color, uSaturation);
    gl_FragColor = vec4(color, 1.0);
}